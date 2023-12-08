const Dotenv = require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const readline = require('readline');

function readFileAndReturnArray(filePath) {
  return new Promise((resolve, reject) => {
    const lines = [];
    
    const readStream = fs.createReadStream(filePath, { encoding: 'utf-8' });
    const rl = readline.createInterface({
      input: readStream,
      crlfDelay: Infinity
    });

    rl.on('line', (line) => {
      lines.push(line);
    });

    rl.on('close', () => {
      resolve(lines);
    });

    readStream.on('error', (err) => {
      reject(err);
    });
  });
}



const IS_AER = [
    "joshua.brionne@epitech.eu",
    "baptiste.leroyer@epitech.eu",
    "lois.maneux@epitech.eu",
  "mathias.andre@epitech.eu",
  "arthur.delbarre@epitech.eu",
  "valentin.dury@epitech.eu",
  "leo.dubosclard@epitech.eu",
  "justin.duc@epitech.eu",
  "thomas.mazaud@epitech.eu",
  "paul.laban@epitech.eu",
  "maxime.dziura@epitech.eu",
  "guilhem.vinet@epitech.eu",
];


const TOKEN = process.env.TOKEN;

const GOOD_GRADES = ["A", "B", "C", "D", "-", "Acquis"];
const epitechAxios = axios.create({
  baseURL: "https://intra.epitech.eu/",
  headers: {
    Cookie: `user=${TOKEN}`,
  },
});

const getStudentInfoNotes = async (login) => {
  const url = "https://intra.epitech.eu/user/" + login + "/notes/?format=json";

  try {
    const response = await epitechAxios.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const getCreditNumberFromModules = (modules) => {
  let credit_total = 0;
  modules.forEach((module) => {
    if (GOOD_GRADES.includes(module.grade)) {
      credit_total += module.credits;
    }
  });
  return credit_total;
};

const getCreditFromSpecificModule = (modules, module_name) => {
  let credit_total = 0;
  modules.forEach((module) => {
    if (
      GOOD_GRADES.includes(module.grade) &&
      module.title.includes(module_name)
    ) {
      credit_total += module.credits;
    }
  });
  return credit_total;
};

const getTepitechGrade = (notes) => {
  const TEPITECH_NAME = "TEPitech";

  let tepitech = 0;

  notes.forEach((note) => {
    if (note.titlemodule.includes(TEPITECH_NAME) && note.scolaryear == 2023) {
      tepitech = note.final_note;
    }
  });
  return tepitech;
};

const normalize = (value, min, max) => {
  return (value - min) / (max - min);
};

const calcPersonalNote = (student) => {
  const TEPITECH_MAX = 990;
  const GPA_MAX = 4;
  const EXTRA_CURRICULAR_MAX = 78;

  const TEPITECH_WEIGHT = 0.15;
  const EXTRA_CURRICULAR_WEIGHT = 0.35;
  const GPA_WEIGHT = 0.5;

  let tepitech = student.tepitech;
  let extra_curricular =
    student.credit_cobra +
    student.credit_ambassadeur +
    student.credit_assos +
    student.hub;
  let gpa = student.gpa;

  tepitech = normalize(tepitech, 0, TEPITECH_MAX);
  extra_curricular = normalize(extra_curricular, 0, EXTRA_CURRICULAR_MAX);
  gpa = normalize(gpa, 0, GPA_MAX);

  const tepitech_note = tepitech * TEPITECH_WEIGHT;
  const extra_curricular_note = extra_curricular * EXTRA_CURRICULAR_WEIGHT;
  const gpa_note = gpa * GPA_WEIGHT;

  return tepitech_note + extra_curricular_note + gpa_note;
};

const CalculGPA = (modules) => {
  const GOOD_GRADES = ["A", "B", "C", "D", "Echec"];

  const GRADE_TO_VALUE = {
    A: 4,
    B: 3,
    C: 2,
    D: 1,
    Echec: 0,
  };

  let total_credit = 0;
  let total_grade = 0;

  modules.forEach((module) => {
    if (GOOD_GRADES.includes(module.grade) && module.credits > 0) {
      const mCredit = module.credits;
      total_credit += mCredit;
      total_grade += GRADE_TO_VALUE[module.grade] * mCredit;
    }
  });
  return total_grade / total_credit;
};

const getCampus = (notes) => {
    return notes[0].codeinstance;
}

const getBunchOfInfo = (data, login) => {
  const COBRA_TITLE = "Epitech Diversity";
  const AMBASSADEUR_TITLE = "Promoting Epitech";
  const ASSOS_TITLE = "Extra Curricular Engagement";
  const HUB_TITLE = "Hub";

  const modules = data.modules;
  const notes = data.notes;
  const gpa = CalculGPA(modules);

  const tepitech = getTepitechGrade(notes);
  const credit_total = getCreditNumberFromModules(modules);
  const credit_cobra = getCreditFromSpecificModule(modules, COBRA_TITLE);
  const credit_ambassadeur = getCreditFromSpecificModule(
    modules,
    AMBASSADEUR_TITLE
  );
  const credit_hub = getCreditFromSpecificModule(modules, HUB_TITLE);
  const credit_assos = getCreditFromSpecificModule(modules, ASSOS_TITLE);

  const is_aer = IS_AER.includes(login);
    const campus = getCampus(notes);
  const personal_note = calcPersonalNote({
    gpa: gpa,
    tepitech: tepitech,
    hub: credit_hub,
    credit_total: credit_total,
    credit_cobra: credit_cobra,
    credit_ambassadeur: credit_ambassadeur,
    credit_assos: credit_assos,
    is_aer: is_aer,
  });

  return {
    gpa: gpa,
    tepitech: tepitech,
    hub: credit_hub,
    credit_total: credit_total,
    credit_cobra: credit_cobra,
    credit_ambassadeur: credit_ambassadeur,
    credit_assos: credit_assos,
    personal_note: personal_note,
    is_aer: is_aer,
    campus: campus.split("-")[0],
  };
};


const script = async () => {
  const EMAILS = await readFileAndReturnArray("email.txt");
  const results = await Promise.all(
    EMAILS.map(async (login) => {
      return await getStudentInfoNotes(login);
    })
  );

  const students = [];
  results.forEach((result, index) => {
    if (index % 50 == 0) {
      setTimeout(() => {}, Math.random() * 10000);
    }
    const student = {
      login: EMAILS[index],
      ...getBunchOfInfo(result, EMAILS[index]),
    };
    students.push(student);
  });

  const personalArr = students.map((student) => {
    return {
      login: student.login,
      personal_note: student.personal_note,
    };
  })

  personalArr.sort((a, b) => b.personal_note - a.personal_note);
  students.sort((a, b) => b.gpa - a.gpa);

  students.forEach((student, index) => {
    student.GPArank = index + 1;
    student.personal_rank = personalArr.findIndex((s) => s.login == student.login) + 1;
  });

  fs.writeFile("students.json", JSON.stringify(students), (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("File has been created");
  });
};

script();
