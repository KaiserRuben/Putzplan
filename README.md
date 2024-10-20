# 🧹 Putzplan System for WGs

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-Supported-blue.svg)](https://www.docker.com/)

A fair and efficient task distribution system for Wohngemeinschaften (WGs) or shared living spaces. Automate your cleaning schedule with ease!

## ✨ Features

- 🔄 Automatic weekly task assignment
- ⚖️ Fair distribution considering task frequency and estimated time
- 🔁 Rotation mechanism to prevent repetitive assignments
- 📊 Transparent task history and time spent for each user
- 🐳 Dockerized for easy setup and deployment

## 🚀 Quick Start

1. Clone this repository:
   ```
   git clone https://github.com/KaiserRuben/Putzplan.git
   ```

2. Create a `data.json` file in the project root (see [Configuration](#configuration) for details).

3. Run with Docker Compose:
   ```
   docker compose up
   ```

4. Access the Putzplan system at `http://localhost:9876`.

## 📸 Screenshots

Here are some screenshots of the Putzplan system in action:

| First Open | Landing Page |
|------------|--------------|
| <img src="screenshots/1.png" width="300" alt="First Open"> | <img src="screenshots/2.png" width="300" alt="Landing Page"> |
| **Task Overview** | **Task Details** |
| <img src="screenshots/3.png" width="300" alt="Task Overview"> | <img src="screenshots/4.png" width="300" alt="Task Details"> |

## 🛠️ Configuration

Create a `data.json` file in the project root with the following structure:

```json
{
  "tasks": [
    {
      "id": 1,
      "name": "Clean Bathroom",
      "frequency": "weekly",
      "estimatedTime": 45,
      "subtasks": [
        {
          "id": 101,
          "name": "Clean Toilet",
          "description": "Thoroughly clean and disinfect the toilet",
          "cleaningProducts": ["Toilet cleaner", "Brush", "Gloves"],
          "tips": "Don't forget to clean under the rim",
          "cautions": "Use gloves and ensure good ventilation"
        },
        // More subtasks...
      ]
    },
    // More tasks...
  ],
  "users": [
    {
      "name": "Alice",
      "color": "#FF5733"
    },
    // More users...
  ]
}
```

### Interfaces:
```ts
export interface Subtask {
   id: number;
   name: string;
   description: string;
   cleaningProducts: string[];
   tips: string;
   cautions: string;
}

export interface Task {
   id: number;
   name: string;
   frequency: 'weekly' | 'bi-weekly' | 'monthly';
   estimatedTime: number;
   subtasks: Subtask[];
}
```


You can find a sample `data.example.json` file in the project root.

## 🤔 How It Works

1. Tasks are defined with properties such as frequency and estimated time.
2. Each week, the system:
   - Determines which tasks are due
   - Distributes tasks evenly among users
   - Rotates the starting point for distribution to ensure long-term fairness
3. The system tracks each user's task history and total time spent.

## ❓ FAQ

**Q: How often are tasks assigned?**
A: Tasks are assigned weekly, but the system considers different frequencies (weekly, bi-weekly, monthly).

**Q: Can I add or remove tasks?**
A: Yes, modify the `data.json` file to add or remove tasks. The system will adjust automatically. Tasks might be reassigned.

**Q: How does the system ensure fairness?**
A: It uses rotation and even distribution.

For:
- n := total time passed
- t_i := time spent by user i, where i ∈ ℕ

As n → ∞:
t_i = t_j for all i, j ∈ ℕ

**Q: Can users swap assigned tasks?**
A: The current system doesn't have a built-in swapping feature. Users can manually agree to swap tasks.

**Q: When does the week change? Why is it Wednesday?**
A: Cause from experience, tasks are usually done on weekends.

**Q: Is my data stored securely?**
A: All user data and task history are stored locally on your device.

**Q: Can I customize the interface appearance?**
A: The current version doesn't include interface customization.

**Q: What if a task takes longer than estimated?**
A: Adjust the estimated time in `data.json` if a task consistently takes longer than expected.

**Q: Can I add new users to the system?**
A: Yes, add new users to the `users` array in `data.json`. They'll be included automatically in task distribution.

**Q: What if someone is away for a week?**
A: The system doesn't have a built-in absence feature. Manually redistribute tasks in such cases.

## 🤝 Contributing

We welcome contributions! Please submit issues and pull requests on our GitHub repository.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.