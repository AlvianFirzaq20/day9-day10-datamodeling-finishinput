const express = require ('express');
const hbs = require ('hbs');
const path = require ('path');
const db = require ('./connection/db.js')

const app = express();
hbs.registerPartials(path.join(__dirname,'/view/partials'));


const PORT = 150;

// const isLogin = true

const projects =[] //tugas day 8

// const isLogin = true;
app.set("view engine", "hbs"); //setup template engine / view engine

app.use("/public", express.static(__dirname + "/public"));

app.use(express.urlencoded({ extended: false }));

const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',];

let project=[{
  title: 'hahahha',
  author: 'Alvian Firzaq',
  date: '25 May 2022 - 30 June 2022',
  checkbox: [
    '<i class="fa-brands fa-html5"></i>',
    '<i class="fa-brands fa-css3-alt"></i>',
    '<i class="fa-brands fa-react"></i>',
    '<i class="fa-brands fa-js-square"></i>'
  ],
  duration: '3 bulan',
  content: 'kgofkgokgorkogrk'
}];

app.get('/', (req, res) => {
  // console.log(projects);
  // res.render('index',{projects});

  db.connect(function(err, client, done){
    if (err) throw err;
    
    const query = 'SELECT * FROM tb_project'

    client.query(query, function(err, result) {
        if (err) throw err;

        const projects = result.rows

        function difference(edate, sdate) {
          sdate = new Date(sdate);
          edate = new Date(edate);
          // const sdateutc = Date.UTC(sdate.getFullYear(), sdate.getMonth(), sdate.getDate());
          // const edateutc = Date.UTC(edate.getFullYear(), edate.getMonth(), edate.getDate());
            day = 1000*60*60*24;
            dif = (edate - sdate)/day;
          return dif < 30 ? dif +" hari" : parseInt(dif/30)+" bulan"
        }
        
        function getFullTime(dateStart,dateEnd){
          dateStart= new Date(dateStart);
          dateEnd = new Date(dateEnd);
          return `${dateStart.getDate()} ${month[dateStart.getMonth()]} ${dateStart.getFullYear()} - ${dateEnd.getDate()} ${month[dateEnd.getMonth()]} ${dateEnd.getFullYear()}`;
        }

        const projectCard = projects.map ((data) => {
          
          return {
              duration: difference(data.end_date, data.start_date),
              ...data
          }
        })
        
        res.render ('index',{projects:projectCard} )
    })
    done()
  })
})

app.get('/add-project',(req, res)=>{
  res.render('addproject')

})

app.post('/add-project',(req,res)=>{

  const name = req.body.title;
  const start_date = req.body.sdate
  const end_date = req.body.edate
  const description = req.body.content;
  const technologies = []
  const image = req.body.image
  
    if (req.body.checkboxHtml) {
        technologies.push('html');
    } else {
        technologies.push('')
    }
    if (req.body.checkboxCss) {
        technologies.push('css');
    } else {
        technologies.push('')
    }
    if (req.body.checkboxReact) {
        technologies.push('react.js');
    } else {
        technologies.push('')
    }
    if (req.body.checkboxJavascript) {
        technologies.push('javascript');
    } else {
        technologies.push('')
    }
  

  db.connect(function (err, client, done) {
    if (err) throw err;

    const query = `INSERT INTO tb_project (name, start_date, end_date, description, technologies, image) 
                  VALUES ('${name}', '${start_date}', '${end_date}', '${description}', ARRAY ['${technologies[0]}', '${technologies[1]}','${technologies[2]}', '${technologies[3]}'], '${image}')`

    client.query(query, function (err, result) {
      if (err) throw err;

      res.redirect('/');
    });

    done();
  });
});


app.get('/add-project/delete/:id',(req,res)=>{
  let id = req.params.id

    db.connect(function(err, client, done) {
        if (err) throw err;

        const query = `DELETE FROM tb_project WHERE id = ${id};`;

        client.query(query, function(err, result) {
            if (err) throw err;

            res.redirect('/');
        });

        done();
    });
})

app.get('/edit-project/:id',(req,res)=>{
  let create = req.params.id;

  db.connect(function(err, client, done){
    if (err) throw err;
    
    const query = `SELECT * FROM tb_project WHERE id =${create}`

    client.query(query, function(err, result) {
        if (err) throw err;

        const projects = result.rows[0]
        projects.start_date = changeTime (projects.start_date);   //perubahan 1
        projects.end_date = changeTime (projects.end_date);

         res.render('edit-project', {
          edit: projects,
          id: create
      })
    })
    done()
  })
})


app.post('/edit-project/:id',(req,res)=>{
  let id = req.params.id

  const name = req.body.title;
  const start_date = req.body.sdate
  const end_date = req.body.edate
  const description = req.body.content;
  const technologies = []
  const image = req.body.image
  
    if (req.body.checkboxHtml) {
        technologies.push('html');
    } else {
        technologies.push('')
    }
    if (req.body.checkboxCss) {
        technologies.push('css');
    } else {
        technologies.push('')
    }
    if (req.body.checkboxReact) {
        technologies.push('react.js');
    } else {
        technologies.push('')
    }
    if (req.body.checkboxJavascript) {
        technologies.push('javascript');
    } else {
        technologies.push('')
    }

  db.connect(function(err, client, done) {
      if (err) throw err;

      const query = `UPDATE tb_project 
                    SET name = '${name}', start_date = '${start_date}', end_date = '${end_date}', description = '${description}', technologies = ARRAY ['${technologies[0]}', '${technologies[1]}','${technologies[2]}', '${technologies[3]}'], image='${image}' 
                    WHERE id=${id};`

      client.query(query, function(err, result) {
          if (err) throw err;

          res.redirect('/')
      })
      done();
  })

}) 

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/project-detail/:id", (req, res) => {
  let id = req.params.id;
 
  db.connect(function(err, client, done){
    if (err) throw err;
    
    const query = `SELECT * FROM tb_project WHERE id = ${id}` //perubahan 1

    client.query(query, function(err, result) {
        if (err) throw err;


        function difference(edate, sdate) {
          sdate = new Date(sdate);
          edate = new Date(edate);
          // const sdateutc = Date.UTC(sdate.getFullYear(), sdate.getMonth(), sdate.getDate());
          // const edateutc = Date.UTC(edate.getFullYear(), edate.getMonth(), edate.getDate());
            day = 1000*60*60*24;
            dif = (edate - sdate)/day;
          return dif < 30 ? dif +" hari" : parseInt(dif/30)+" bulan"
        }
        
        function getFullTime(time){
          time = new Date(time);
          const date = time.getDate();
          const monthIndex = time.getMonth();
          const year = time.getFullYear();
          let hour = time.getHours();
          let minute = time.getMinutes();
          const fullTime = `${date} ${month[monthIndex]} ${year}`;

    return fullTime
        }

        const detailProject = result.rows[0]
        
        detailProject.start_date = getFullTime(detailProject.start_date)
        detailProject.end_date = getFullTime(detailProject.end_date)
        detailProject.duration = difference (detailProject.end_date, detailProject.start_date)

        res.render ('project-detail',{ projects: detailProject } ) //perubahan 3
    })
    done()
  })

});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

function difference(sdate, edate) {
  sdate = new Date(sdate);
  edate = new Date(edate);
  const sdateutc = Date.UTC(sdate.getFullYear(), sdate.getMonth(), sdate.getDate());
  const edateutc = Date.UTC(edate.getFullYear(), edate.getMonth(), edate.getDate());
    day = 1000*60*60*24;
    dif =(edateutc - sdateutc)/day;
  return dif < 30 ? dif +" hari" : parseInt(dif/30)+" bulan"
}

function getFullTime(dateStart,dateEnd){
  dateStart= new Date(dateStart);
  dateEnd = new Date(dateEnd);
  return `${dateStart.getDate()} ${month[dateStart.getMonth()]} ${dateStart.getFullYear()} - ${dateEnd.getDate()} ${month[dateEnd.getMonth()]} ${dateEnd.getFullYear()}`;
}

function changeTime (time) {  //memunculkan start_date sama end_date pada app.get edit.
  let newTime = new Date (time);
  const date = newTime.getDate ();
  const monthIndex = newTime.getMonth () + 1;
  const year = newTime.getFullYear ();

  if(monthIndex<10){
    monthformat = '0' + monthIndex;
  } else {
    monthformat = monthIndex;
  }

  if(date<10){
    dateformat = '0' + date;
  } else {
    dateformat = date;
  }

  const fullTime = `${year}-${monthformat}-${dateformat}`;
  
  return fullTime;
}