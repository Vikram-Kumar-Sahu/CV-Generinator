import Styles from './App.module.css';
import CVGenerator from './components/CVGenerator';
import { useState,useRef } from 'react';
import html2pdf from 'html2pdf.js';

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(''); // State to track email validation error
  const [number, setNumber] = useState('');
  const [school, setSchool] = useState('');
  const [company, setCompany] = useState('');
  const [submittedData, setSubmittedData] = useState(null);

  const prompts = [
    "Organize the following unstructured education details into a professional Education section for a resume. Maintain clarity, proper formatting. Include only the provided information, without adding extra details or embellishments. Ensure it is ready to be directly pasted into the resume (remove any headings like: Education) (example format :Bachelor of Communications, New York University, New York August 2016 August 2021 Working towards a Communications Degree.High School Diploma, Regis High School, New York September 2012 May 2016 Graduated with High Honors) also dont give any examples",
    "Organize the following unstructured practical experience details into a professional Practical Experience section for a resume. Maintain clarity, proper formatting, and consistency in font style and size. Include only the provided information, without adding extra details or embellishments. Ensure it is ready to be directly pasted into the resume (**Practical Experience**  * dont show this part )(example format : Senior Administrative Assistant, Grant Technology, San Luis Obispo, CA Advanced administrative and project support for senior-level consultants.03/2018-present Project Coordination/Management Led a project to streamline and reorganize SharePoint project management system, resulting in more accessible information and enhanced support for clients.Coordinated project plan with team, scheduled and budgeted for small but high-profile project during project manager's absence. Commended for initiative and problem-solving abilities.Advanced Administrative Support Prepared best-practice guidelines for archiving project documents. Guidelines were adopted company wide.Conducted research and trained staff on new techniques for document versioning that significantly reduced retrieval time and lost documents.Administrative Assistant, Training Solutions, Inc., Monterey, CA 11/2015-02/2018 Provided advanced administrative support to top marketing executive in fast-paced training start-up company.Project Coordination/Management Coordinated the research and production of client-winning training proposals.Streamlined proposal development process, resulting in significant time savings.Advanced Administrative Support Planned and assembled materials for high-profile client meetings.Created and monitored new client tracking system using Microsoft Excel) also dont give any examples"
  ];
  const places =[
    "A section to add your educational experience (school name, title of study and date of study)",
    "A section to add practical experience (company name, position title, main responsibilities of your jobs, date from and until when you worked for that company)"
  ]

  const pdfRef = useRef();

const handleDownloadPDF = () => {
  const element = pdfRef.current;
  const opt = {
    margin:       0.5,
    filename:     'My_CV.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 4},
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save();
};


  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    // Validate email format
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value)) {
      setEmailError('Email must be in ...@gmail.com format');
    } else {
      setEmailError(''); // Clear error if valid
    }
  };

  const handleSubmit = () => {
    if (emailError) {
      alert('Please fix the errors before submitting.');
      return;
    }

    setSubmittedData({
      name,
      email,
      number,
      school,
      company,
    });
  };

  return (
    <div className={Styles.container}>
     <center><h1 className={Styles.heading}>CV Generator</h1></center>
     <div className={Styles.content1}>
      <div className={Styles.name}>
        <span>Name: </span>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          className='inp1'
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </div>
      <div className={Styles.email}>
        <span>Email: </span>
        <input
          type="text"
          placeholder="Enter your email"
          value={email}
          className='inp1'
          onChange={handleEmailChange}
        />
        {emailError && <p style={{ color: 'red' }}>{emailError}</p>} {/* Display email error */}
      </div>
      <div className={Styles.phone}>
        <span>Phone Number: </span>
        <input
          type="number"
          inputMode='numeric'
          placeholder="Enter your phone num"
          value={number}
          className='inp1'
          onChange={(e) => {
            setNumber(e.target.value);
          }}
        />
      </div>
      </div>
      <hr />
      <div className={Styles.content2}>
      <div className={Styles.school}>
        <span className={Styles.edu}>Educational Information: </span>
        <CVGenerator setData={setSchool} prompt={prompts[0]} place={places[0]} />
      </div>
      <hr />
      <div className={Styles.company} >
        <span className={Styles.edu}>Practical Information: </span>
        <CVGenerator setData={setCompany} prompt={prompts[1]} place={places[1]} />
      </div>
      </div>
      <button onClick={handleSubmit}>SUBMIT</button>

      {submittedData && (
  <>
    <div ref={pdfRef} className={Styles.submitted}>
      <h2>CV Summary</h2>

      <div className={Styles["cv-section"]}>
        <p className={Styles["section-title"]}>Personal Information</p>
        <p className={Styles["cv-item"]}><strong>Name:</strong> {submittedData.name}</p>
        <p className={Styles["cv-item"]}><strong>Email:</strong> {submittedData.email}</p>
        <p className={Styles["cv-item"]}><strong>Phone:</strong> {submittedData.number}</p>
      </div>

      <div className={Styles["cv-section"]}>
        <p className={Styles["section-title"]}>Educational Background</p>
        <p className={Styles["cv-item"]}>{submittedData.school}</p>
      </div>

      <div className={Styles["cv-section"]}>
        <p className={Styles["section-title"]}>Practical Experience</p>
        <p className={Styles["cv-item"]}>{submittedData.company}</p>
      </div>
      
    </div>
<button onClick={handleDownloadPDF}>Download as PDF</button>
    
  </>
)}


    </div>
  );
}

export default App;