# 🎓 **EduCanvas Live**

### *Empowering Interactive Learning Through Real-Time Collaboration*

EduCanvas Live is a real-time collaborative learning platform that brings the interactivity of a physical classroom into the digital world through synchronized whiteboards, live audio/video communication, and intuitive design.

---

# 📑 **Table of Contents**

1. Overview
2. Problem Statement
3. Our Solution
4. Key Features
5. Technology Stack
6. User Workflow
7. UI/UX Principles
8. Detailed Working
9. Future Roadmap
10. Team
11. License

---

# 📘 **1. Overview**

EduCanvas Live enhances digital learning by supporting:

1. Real-time whiteboard collaboration
2. Live video/audio sessions
3. Instant updates with zero lag
4. Seamless interaction between teachers and students
5. Simple and clean UI for distraction-free learning

Its purpose is to **make online classes engaging, interactive, and highly effective**.

---

# ❗ **2. Problem Statement**

Online classes commonly face problems such as:

1. Low student engagement
2. Lack of real-time collaboration
3. Delayed response or feedback
4. Poor tools for drawing, explaining, or demonstrating
5. Difficulty maintaining classroom-like communication

---

# 💡 **3. Our Solution**

EduCanvas Live solves these challenges by offering:

1. A synchronized collaborative whiteboard
2. High-quality video/audio communication
3. Smooth, low-latency interactions
4. Room-based collaboration for multiple users
5. A clean UI that supports focused learning

---

# 🚀 **4. Key Features**

## **4.1 Real-Time Collaborative Whiteboard**

* Multiple users can draw simultaneously
* Every stroke updates instantly
* Useful for diagrams, equations, notes & visual explanations

---

## **4.2 Live Video & Audio Calling**

* Built using WebRTC
* Low-latency peer-to-peer communication
* Supports face-to-face discussion during collaboration

---

## **4.3 Zero-Latency Synchronization**

* Uses Socket.io for instant real-time updates
* No noticeable lag during drawing or writing
* Ensures all users see the same state at the same moment

---

## **4.4 Room-Based Collaboration**

* Join or create rooms with unique codes
* Easy switching between rooms
* Supports multiple participants

---

## **4.5 Responsive & Clean UI**

* Works on desktops, tablets, and smartphones
* Minimal interface for distraction-free learning
* Easy-to-access tools and controls

---

# 🧰 **5. Technology Stack**

## **5.1 Frontend**

1. React.js
2. Tailwind CSS
3. Socket.io Client
4. PeerJS (WebRTC)

## **5.2 Backend**

1. Node.js
2. Express.js
3. Socket.io Server
4. WebRTC Signaling

---

# 👥 **6. User Workflow**

1. **Open EduCanvas Live**
2. **Create or Join a Room**
3. **Connect Through Sockets & WebRTC**
4. **Start Drawing on Whiteboard**
5. **Enable Video/Audio for Live Discussion**
6. **Collaborate Until Session Ends**

This workflow ensures fast and easy usage for both teachers and students.

---

# 🎨 **7. UI/UX Principles**

## **7.1 Minimal & Clean**

* Interface focuses on the whiteboard and communication
* No unnecessary elements

## **7.2 Intuitive Controls**

* Easy to use drawing tools
* Clear options for video/audio

## **7.3 Real-Time Feedback**

* Immediate visual confirmation of actions
* Smooth interactions

## **7.4 Fully Responsive**

* Works seamlessly across screens of all sizes

---

# 🔍 **8. Detailed Working**

## **8.1 Whiteboard Synchronization**

1. Every stroke is converted into an event
2. Event sent to server using Socket.io
3. Server broadcasts event to all users
4. All clients update their canvases instantly

---

## **8.2 Video/Audio Communication**

1. User enables camera/microphone
2. PeerJS creates WebRTC connection
3. Signals exchanged through server
4. Media streams appear for all participants

---

## **8.3 Room Handling**

1. Each room has a unique ID
2. Users join a specific room
3. Server tracks active users
4. New joiners receive the latest whiteboard state

---

## **8.4 Multi-User Synchronization**

1. Each user is assigned a unique socket
2. All events include sender information
3. System ensures clean synchronization even under load

---

# 🌱 **9. Future Roadmap**

## **9.1 Planned Enhancements**

1. AI-powered tutoring & suggestion system
2. Engagement analytics dashboard
3. Screen-sharing feature
4. File uploads (PDF, images, notes)
5. Advanced whiteboard tools
6. Native Android & iOS apps
7. Real-time text tool & shape tool
8. Voice-to-text note generation

---

# 👨‍💻 **10. Team**

| Member                 | Role                 | Expertise                    |
| ---------------------- | -------------------- | ---------------------------- |
| **Gaurangi Gaur**      | Frontend Developer   | React, UI/UX                 |
| **Bittu Kumar Singh**  | Backend Developer    | Node.js, Socket Architecture |
| **Yash Purwar**        | Full Stack Developer | WebRTC, App Integration      |
| **Abhiyansh Varshney** | UI/UX Designer       | Interface Design & Testing   |

---

# 🎉 **Conclusion**

EduCanvas Live redefines online learning by offering **instant collaboration, real-time communication, and a highly interactive user experience**. It brings the effectiveness, clarity, and engagement of traditional classrooms into the digital world, making learning more dynamic and enjoyable.


