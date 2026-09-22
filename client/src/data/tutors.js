const standardSessionTimes = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];
const tutors = [
  {
    id: 1,
    name: "Sarah Mitchell",
    subject: "Mathematics",
    experience: "8 years",
    image: "/images/tutors/math-tutor.png",
    
    times: [...standardSessionTimes],
  },
  {
    id: 2,
    name: "Daniel Carter",
    subject: "Science",
    experience: "6 years",
    image: "/images/tutors/science-tutor.png",
    
    times: [...standardSessionTimes],
  },
  {
    id: 3,
    name: "Olivia Brown",
    subject: "Social Studies",
    experience: "9 years",
    image: "/images/tutors/social-studies-tutor.png",
    times: ["9:30 AM", "12:30 PM", "5:00 PM"],
  },
  {
    id: 4,
    name: "Michael Lee",
    subject: "Computer Skills",
    experience: "5 years",
    image: "/images/tutors/computer-tutor.png",
    times: [...standardSessionTimes],
  },
  {
    id: 5,
    name: "Emily Johnson",
    subject: "English",
    experience: "7 years",
    image: "/images/tutors/english-tutor.png",
    times: [...standardSessionTimes],
  },
];

export default tutors;
