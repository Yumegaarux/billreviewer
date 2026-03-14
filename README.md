# Bill Reviewer System.

## **1. Overview**
The Bill Reviewer System is a web platform that lets people explore and share their opinions on Philippine Senate bills. Users can create accounts, read bills, leave comments, and rate them, giving each bill an overall public rating.

The system aims to simulate how an ordinary citizen might review legislation, allowing users to engage with bills in a simple and interactive way. By collecting comments and ratings, it provides a snapshot of public sentiment and encourages discussion around important legislative topics.

----

## **2. Features**

* **User Accounts** – Create, log in, and manage accounts.
* **Bill Browsing** – View a list of Senate bills with details.
* **Commenting** – Share thoughts and opinions on individual bills.
* **Rating** – Rate bills and see aggregated public ratings.
* **API Integration** – Fetches bills and handles interactions in real-time.
* **Random Access Simulation** – Users experience bill reviews as a regular citizen.

---

## **3. System Architecture**

The system is built with:

* **Frontend:** React.js, HTML, CSS
* **Backend:** PHP
* **Database:** MySQL
* **Deployment:** Docker containers for easy setup and consistent environment

The **frontend** handles the user interface and interactions, while the **backend** manages data storage, authentication, and API communication. Docker ensures that both parts can run smoothly together on any computer without complex setup.

---

## **4. Setup and Running the System**

### **Prerequisites**

* [Docker](https://www.docker.com/get-started) installed
* Basic knowledge of running commands in a terminal

### **Steps**

1. **Clone the project repository**

```bash
git clone <https://github.com/Yumegaarux/billreviewer.git>
cd <billreviewer>
```

2. **Build and run the Docker containers**

```bash
docker compose up --build
```

This will build the frontend and backend containers and start the system.

3. **Access the system**

* Open a browser and go to: `http://localhost:3000` (or the port you configured)
* You should see the Bill Reviewer System homepage.

4. **Stop the system**

```bash
docker compose down
```

---

## **5. Usage**

1. **Sign Up / Log In** – Create an account or log in to access full features.
2. **Browse Bills** – Explore available Senate bills.
3. **Rate Bills** – Give a rating (e.g., 1–5 stars) to a bill.
4. **Comment** – Share your opinion or feedback on a bill.
5. **View Public Ratings** – Check aggregated ratings and comments from other users.

---

## **6. Notes**

* Docker is used to simplify setup and avoid dependency issues. You don’t need to install Node.js, PHP, or other dependencies manually.
* Any changes to frontend code may require rebuilding the frontend container (`docker compose up --build`) if live reloading isn’t enabled.

---

## **7. Future Improvements**

* Add **admin accounts** for managing bills.
* Allow **searching and filtering** bills by topic or rating.
* Improve **UI/UX** for better user experience.
* Enable **real-time updates** using WebSockets for comments and ratings.

---


