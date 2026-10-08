import express from "express";
import bodyParser from "body-parser";

const port = process.env.PORT  || 3000 ;
const app = express();
app.use(express.static('public'))
// Starts the Express server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// Middleware that lets Express read data sent from HTML forms
app.use(bodyParser.urlencoded({ extended: true }));

// Temporary storage for all blog posts
let posts = [];

// Used to give every new post a unique id
let id = 1;

// Home page - displays all blog posts
app.get("/", (req, res) => {
  res.render("landingpage.ejs", {
    posts: posts,
  });
});

// Page for creating a new blog post
app.get("/new", (req, res) => {
  res.render("new.ejs");
});

// Displays one specific blog post based on its id
app.get("/posts/:id", (req, res) => {
  let objectContentId = Number(req.params.id);

  // Search through the posts array for the matching post
  for (let i = 0; i < posts.length; i++) {
    if (posts[i].id === objectContentId) {
      return res.render("content.ejs", {
        title: posts[i].title,
        content: posts[i].content,
        id : posts[i].id
      });
    }
  }

  // Runs if no matching post was found
  res.status(404).send("Webpage Not Found");
});

app.
get("/edit/:id",(req,res)=>{
  let urlId = Number(req.params.id);
  // Search through the posts array for the matching post
  for (let i = 0; i < posts.length; i++) {
    if (posts[i].id === urlId) {
      return res.render("edit.ejs", {
        title: posts[i].title,
        content: posts[i].content,
        id : posts[i].id
      });
    }
  }
   res.status(404).send("Webpage Not Found");
})

// Handles the form submission for creating a new post
app.post("/", (req, res) => {
  const info = {
    id: id,
    title: req.body.titlename,
    content: req.body.content,
  };

  // Prepare the id for the next post
  id++;

  // Add the new post to the posts array
  posts.push(info);

  // Return the user to the home page
  res.redirect("/");
});

app.post("/edit/:id",(req,res)=>{
   let editId = Number(req.params.id);
  // Search through the posts array for the matching post
  for (let i = 0; i < posts.length; i++) {
    if (posts[i].id === editId) {
      posts[i].title = req.body.editedTitle;
      posts[i].content = req.body.editedContent;
    }
  }
  res.redirect(`/posts/${editId}`);


})

app.post("/delete/:id",(req,res)=>{
  let deleteId = Number(req.params.id);
  for(let i = 0;i<posts.length;i++){
    if(posts[i].id === deleteId){
      posts.splice(i,1);
    }
  }
  res.redirect("/");
})