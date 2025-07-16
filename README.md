# 🚀 JobSyncer – AI-Powered Resume Matcher & ATS Checker

**JobSyncer** is an intelligent tool built with Flask and machine learning to help job seekers analyze how well their resume matches a job description. It calculates match scores, checks ATS-friendliness, and highlights missing keywords — all in one simple interface.

---

## ✨ Features

✅ AI-powered resume and job description matching  
📄 ATS-friendly analysis (formatting, sections, readability)  
🧠 Smart keyword suggestions based on job description  
📥 PDF resume support with real-time parsing  
📊 Downloadable analysis report  
🖥️ Clean and responsive user interface  

---

## 🛠️ Tech Stack

**Frontend**: HTML, CSS, JavaScript  
**Backend**: Python (Flask)  
**NLP**: Sentence Transformers (`all-MiniLM-L6-v2`)  
**Similarity**: scikit-learn (cosine similarity)  
**PDF Parsing**: PyMuPDF (`fitz`)

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/JobSyncer.git
cd JobSyncer
```

### 2️⃣ Set Up Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3️⃣ Install Dependencies
```bash
pip install -r requirements.txt
```

### 4️⃣ Run the App
```bash
python app.py
```

### 5️⃣ Open in Browser

```bash
http://localhost:5000
```
### 📁 Project Structure
```php
JobSyncer/
├── app.py                             # Flask backend application logic
├── requirements.txt                   # Python dependencies
├── static/
│   ├── style.css                      # CSS styling
│   ├── script.js                      # JavaScript interactivity
│   └── image/
│       └── resume_image2-removebg-preview (1).png
├── templates/
│   └── index.html                     # Flask HTML template
└── README.md                          # Project documentation
```
