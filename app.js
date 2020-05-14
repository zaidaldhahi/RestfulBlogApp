var bodyParser = require("body-parser");
methodOverride = require("method-override");
mongoose  	   = require("mongoose");
express    	   = require("express");
app 	       = express();

//App config
mongoose.connect("mongodb://localhost/restful_blog_app", {useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

//Mongoose model config
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
// 	title: "Husky",
// 	image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ8ccAW19H138OTMJgoaXIZFRy7pcba5DWJzd-khmjrozglGeL8&usqp=CAU",
// 	body: "This is my dog",
// });

//Restful routes
app.get("/", function(req, res){
	res.redirect("/blogs");
});

//Index route
app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs){
		if(err){
			console.log(err);
		} else {
			res.render("index", {blogs: blogs});
		}
	});
});

// NEW route
app.get("/blogs/new", function(req, res){
	res.render("new");
});

//Create route
app.post("/blogs", function(req, res){
	// console.log(req.body.blog);
	Blog.create(req.body.blog);
	res.redirect("/blogs");
});

//Show route
app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, foundElement){
		if(err){
			res.redirect("/");
		} else {
			res.render("show", {blogs: foundElement});
		}
	});
});

//Edit route
app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, foundElement){
		if(err){
			res.redirect("/");
		} else {
			res.render("edit", {blogs: foundElement});
		}
	});
	
});

//Update route
app.put("/blogs/:id", function(req, res){
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, foundElement){
		if(err){
			res.redirect("/");
		} else {
			res.redirect("/blogs/"+req.params.id);
		}
	});
});

//Update route
app.delete("/blogs/:id", function(req, res){
	Blog.findByIdAndDelete(req.params.id, function(err, foundElement){
		if(err){
			res.redirect("/");
		} else {
			res.redirect("/blogs/");
		}
	});
});

app.listen(process.env.PORT||3000, process.env.IP, function(){
	console.log("Server connected...")
});