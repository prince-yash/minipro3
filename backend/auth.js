const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Try to initialize Prisma client; if it fails, use file-based storage fallback
let prisma = null;
try {
	// eslint-disable-next-line global-require
	const { PrismaClient } = require('@prisma/client');
	prisma = new PrismaClient();
	console.log('Prisma client initialized');
} catch (e) {
	console.warn('Prisma client not available, falling back to file storage for auth:', e.message);
	prisma = null;
}

// File-based storage details (fallback)
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

function ensureDataFile() {
	if (!fs.existsSync(DATA_DIR)) {
		fs.mkdirSync(DATA_DIR, { recursive: true });
	}
	if (!fs.existsSync(USERS_FILE)) {
		fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2), 'utf8');
	}
}

function readUsersFile() {
	try {
		ensureDataFile();
		const raw = fs.readFileSync(USERS_FILE, 'utf8');
		if (!raw.trim()) return [];
		return JSON.parse(raw);
	} catch (err) {
		console.error('Failed to read users file, resetting file:', err);
		return [];
	}
}

function writeUsersFile(users) {
	try {
		ensureDataFile();
		fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
	} catch (err) {
		console.error('Failed to write users file:', err);
		throw err;
	}
}

function generateId() {
	return Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
}

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-me';
const JWT_EXPIRY = '7d'; // Token expires in 7 days

// Helper functions that work with Prisma if available, otherwise use file storage
async function findUserByEmailOrUsername(value) {
	if (prisma) {
		return await prisma.user.findFirst({
			where: {
				OR: [{ email: value }, { username: value }]
			}
		});
	} else {
		const users = readUsersFile();
		return users.find(u => u.email === value || u.username === value) || null;
	}
}

async function findUserById(id) {
	if (prisma) {
		return await prisma.user.findUnique({ where: { id } });
	} else {
		const users = readUsersFile();
		return users.find(u => u.id === id) || null;
	}
}

async function createUser({ email, username, passwordHash, role }) {
	if (prisma) {
		return await prisma.user.create({
			data: {
				email,
				username,
				password: passwordHash,
				role
			}
		});
	} else {
		const users = readUsersFile();
		const now = new Date().toISOString();
		const user = {
			id: generateId(),
			email,
			username,
			password: passwordHash,
			role,
			createdAt: now,
			updatedAt: now
		};
		users.push(user);
		writeUsersFile(users);
		// Return object shape similar to Prisma create result
		return {
			id: user.id,
			email: user.email,
			username: user.username,
			role: user.role,
			createdAt: user.createdAt
		};
	}
}

/**
 * Register a new user
 */
async function register(req, res) {
	try {
		const { email, username, password, role = 'student', adminCode } = req.body;

		// Validate input
		if (!email || !username || !password) {
			return res.status(400).json({ error: 'Email, username, and password are required' });
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({ error: 'Invalid email format' });
		}

		if (password.length < 6) {
			return res.status(400).json({ error: 'Password must be at least 6 characters' });
		}

		if (role !== 'student' && role !== 'admin') {
			return res.status(400).json({ error: 'Role must be either "student" or "admin"' });
		}

		const ADMIN_CODE = process.env.ADMIN_CODE || 'teach123';
		let finalRole = role;
		if (role === 'admin') {
			if (!adminCode || adminCode !== ADMIN_CODE) {
				return res.status(403).json({ error: 'Invalid admin code' });
			}
			finalRole = 'admin';
		}

		// Check if user already exists
		const existingUser = await findUserByEmailOrUsername(email) || await findUserByEmailOrUsername(username);
		if (existingUser) {
			if (existingUser.email === email) {
				return res.status(409).json({ error: 'Email already registered' });
			} else {
				return res.status(409).json({ error: 'Username already taken' });
			}
		}

		// Hash password and create user
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await createUser({
			email,
			username,
			passwordHash: hashedPassword,
			role: finalRole
		});

		// Generate JWT token
		const token = jwt.sign({ userId: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRY });

		res.status(201).json({
			message: 'User registered successfully',
			token,
			user: {
				id: user.id,
				email: user.email,
				username: user.username,
				role: user.role,
				createdAt: user.createdAt
			}
		});
	} catch (error) {
		console.error('Registration error:', error);
		res.status(500).json({ error: 'Failed to register user' });
	}
}

/**
 * Login user
 */
async function login(req, res) {
	try {
		const { emailOrUsername, password } = req.body;
		if (!emailOrUsername || !password) {
			return res.status(400).json({ error: 'Email/username and password are required' });
		}

		const user = await findUserByEmailOrUsername(emailOrUsername);
		if (!user) {
			return res.status(401).json({ error: 'Invalid credentials' });
		}

		const isValidPassword = await bcrypt.compare(password, user.password);
		if (!isValidPassword) {
			return res.status(401).json({ error: 'Invalid credentials' });
		}

		const token = jwt.sign({ userId: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRY });

		res.status(200).json({
			message: 'Login successful',
			token,
			user: {
				id: user.id,
				email: user.email,
				username: user.username,
				role: user.role
			}
		});
	} catch (error) {
		console.error('Login error:', error);
		res.status(500).json({ error: 'Failed to login' });
	}
}

/**
 * Verify JWT token middleware
 */
function verifyToken(req, res, next) {
	const token = req.headers.authorization?.replace('Bearer ', '');
	if (!token) {
		return res.status(401).json({ error: 'No token provided' });
	}
	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		req.user = decoded;
		next();
	} catch (error) {
		return res.status(401).json({ error: 'Invalid or expired token' });
	}
}

/**
 * Get current user profile
 */
async function getProfile(req, res) {
	try {
		const user = await findUserById(req.user.userId);
		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}
		res.status(200).json({
			user: {
				id: user.id,
				email: user.email,
				username: user.username,
				role: user.role,
				createdAt: user.createdAt
			}
		});
	} catch (error) {
		console.error('Profile fetch error:', error);
		res.status(500).json({ error: 'Failed to fetch profile' });
	}
}

module.exports = {
	register,
	login,
	verifyToken,
	getProfile,
};
