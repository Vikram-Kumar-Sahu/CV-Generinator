import Styles from './App.module.css';
import CVGenerator from './components/CVGenerator';
import { useState } from 'react';

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
          onChange={(e) => {
            setNumber(e.target.value);
          }}
        />
      </div>
      </div>
      <hr />
      <div className={Styles.content2}>
      <div className={Styles.school} style={{width: "50%"}}>
        <span>Educational Information: </span>
        <CVGenerator setData={setSchool} prompt={prompts[0]} place={places[0]} />
      </div>
      <hr />
      <div className={Styles.company} style={{width: "50%", }}>
        <span>Practical Information: </span>
        <CVGenerator setData={setCompany} prompt={prompts[1]} place={places[1]} />
      </div>
      </div>
      <button onClick={handleSubmit}>SUBMIT</button>

      {submittedData && (
        <div className="submitted-data">
          <h2>YOUR CV:</h2>
          <p>Name: {submittedData.name}</p>
          <p>Email: {submittedData.email}</p>
          <p>Phone Number: {submittedData.number}</p>
          <hr />
          <p>Educational Information: </p>
          <p>{submittedData.school}</p>
          <hr />
          <p>Practical Experience: </p>
          <p>{submittedData.company}</p>
        </div>
      )}
    </div>
  );
}

export default App;