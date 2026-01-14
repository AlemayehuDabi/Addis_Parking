![addis parking](https://github.com/user-attachments/assets/42669d02-d8bd-41a3-87ca-1f72635eecf0)
# 🚗 AddisParking: IoT-Driven Smart Parking System

AddisParking is a full-stack IoT solution designed to modernize the urban parking infrastructure of Addis Ababa. By bridging physical hardware (ESP32/Ultrasonic Sensors) with a high-performance cloud backend (NestJS/MongoDB), the platform provides sub-second real-time updates and seamless reservation workflows.

## 🏗️ System Architecture

The project is built on **"System Thinking"** principles to handle high-frequency data (60ms sampling) without compromising database integrity or system performance.

### 1. Hardware Layer (The Edge)
*   **MCU:** ESP32 Dev Module.
*   **Logic:** Sensors sample distances every 60ms. To prevent network congestion, the firmware implements **State-Change Logic**—only transmitting data via WebSockets when a car physically arrives or departs.
*   **Hysteresis:** Software-level noise filtering ensures that sensor "flicker" doesn't trigger false occupancy events.

### 2. Backend Layer (The Brain)
*   **Framework:** NestJS (Node.js) with TypeScript.
*   **Communication:** Raw WebSockets (WsAdapter) for lightweight, low-latency communication with hardware.
*   **Optimization:** An in-memory state map tracks the status of every parking spot, ensuring the database is only hit during confirmed state transitions (Available ↔ Occupied).
*   **Security:** Authentication handled via **Better-Auth** with MongoDB adapters.

### 3. Database Layer (The Persistence)
*   **Storage:** MongoDB (Mongoose).
*   **Geospatial Intelligence:** Utilizes `2dsphere` indexing to enable high-speed coordinate-based searches (find nearest parking lots within X km).
*   **State Machine:** A robust reservation schema prevents double-booking using a logic-gate query: `(StartA < EndB) AND (EndA > StartB)`.

## 🛠️ Tech Stack

- **Backend:** NestJS, TypeScript, WebSockets, RxJS.
- **Frontend:** React/Next.js, Tailwind CSS, Socket.io-client.
- **Database:** MongoDB (Mongoose).
- **Auth:** Better-Auth.
- **Hardware:** C++, ESP32, Ultrasonic Sensors (HC-SR04).

## 🚀 Key Features

*   **Real-Time Map:** Visual representation of parking lots in Addis Ababa (Bole, Piazza, Kazanchis) with live color-coded spot status.
*   **Smart Reservations:** Conflict-free booking engine with automated "No-Show" detection.
*   **Proximity Search:** Users can locate the nearest available lot based on their current GPS coordinates.
*   **Hardware-to-Cloud Sync:** Automated check-ins; the system detects when a reserved user arrives at their assigned spot.

## 📂 Project Structure

```text
├── hardware/           # C++ ESP32 Firmware (local for now)
├── backend/            # NestJS API & WebSocket Gateway
│   ├── src/parking/    # Core logic, Gateways, and Services
│   ├── src/auth/       # Better-Auth integration
│   └── src/schemas/    # Mongoose Models (Lot, Spot, Reservation)
└── frontend/           # React Dashboard & Client App

🔧 Installation & Setup
1. Clone the repo: git clone https://github.com/yourusername/addisparking.git
2. Backend:
   - cd backend && npm install
   - Configure .env with MONGODB_URI and BETTER_AUTH_SECRET.
   - npm run start:dev
3. Hardware:
   - Open hardware/esp32_logic.ino in Arduino IDE.
   - Update ssid, password, and ws_host (Your local IP).
   - Flash to ESP32.

```

-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Developed with a focus on urban scalability in Ethiopia.
