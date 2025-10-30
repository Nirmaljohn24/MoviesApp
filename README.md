#  MoviesApp

A full-stack **Movies Management Application** built using the **MERN stack (MongoDB, Express, React, Node.js)**.  
It allows users to **add, edit, delete, and view** movies, with **image upload** functionality using **Multer**.

---

##  Features

-  Create, Read, Update, Delete (CRUD) movie records  
-  Upload and store movie posters using **Multer**  
-  Search and filter movies easily  
-  RESTful API built with **Express.js** and **MongoDB**  
-  Responsive frontend built with **React.js**

---

##  Tech Stack

**Frontend:** React.js, Axios, Tailwind CSS / Bootstrap  
**Backend:** Node.js, Express.js  
**Database:** MongoDB  
**File Upload:** Multer  

---

##  Installation 

```bash
npm install
```

## Run the app

***Backend:***
```bash
npm run dev
```


***Frontend:***

```bash

npm run dev

```
---

## App will run on:

***Frontend*** → http://localhost:5173
***Backend*** → http://localhost:5000

---

## Image Upload

This app uses Multer to handle file uploads.

Uploaded images are stored in the uploads/ directory.

The file path is saved in the MongoDB collection for each movie.

Example structure:

---

backend/
├── uploads/
│   ├── movie1.jpg
│   ├── movie2.png

---

---
