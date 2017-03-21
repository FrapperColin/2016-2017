 <%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
		<meta charset="utf-8" />
	    <title>Timeline Nobel Prizes</title>
	
		<!-- boostrap css -->
	    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css" rel="stylesheet">
	    <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet">
	    <link href="http://mdbootstrap.com/mdbcdn/mdb.min.css" rel="stylesheet">
	    <!-- google icon -->
	    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
	    
		<!-- page css  -->
	    <link href="Style/style.css" rel="stylesheet">
		<!-- form css  -->
	    <link href="Style/form.css" rel="stylesheet">
	    
	</head>
	<body>
		<div class="wide" style="background-image: url(Images/background_presentation.jpg)">
			
			<div style="position: absolute; top: 0; left: 0; width: 150px; text-align:right;">${Message}</div>
	  
	            <div class="col-xs-5 line"><hr></div>
	            <div class="col-xs-2 logo">Timeline Nobel Prizes</div>
	            <div class="col-xs-5 line"><hr></div>
	            
	            <!-- Sliding div register -->
	           
				<div id="slider_register" style="right:-342px;">
					<div id="sidebar_register" onclick="open_panel_register()">
						<span class="glyphicon glyphicon-plus-sign">
						</span>
					</div>
					<div id="headerRegister">
						<h3>Register !</h3>
						<form id="login-form" action="register" method="post">
				            <div class="form-group">
								<label for="email">Email :</label>
								<input type="text" class="form-control" id="name" name ="email" placeholder="Enter email" >
						    </div>
						    <div class="form-group">
								<label for="username">Username :</label>
								<input type="text" class="form-control" id="name" name ="username" placeholder="Enter name" >
						    </div>
						    <div class="form-group">
								<label for="pwd">Password :</label>
								<input type="password" class="form-control" id="pwd" name ="password" placeholder="Enter password">
						    </div>
						    <button type="submit" class="btn btn-default">Submit</button>
					  	</form>
					</div>
				</div>
				
	            <!-- Sliding div login-->
				<div id="slider_login" style="right:-342px;">
					<div id="sidebar_login" onclick="open_panel_login()"><i class="fa fa-sign-in" ></i></div>
					<div id="headerLogin">
						<h3>Sign up ! </h3>
						<form id="login-form" action="login" method="post">
				            <div class="form-group">
								<label for="username">Username :</label>
								<input type="text" class="form-control" id="name" name ="username" placeholder="Enter name" >
						    </div>
						    <div class="form-group">
								<label for="pwd">Password :</label>
								<input type="password" class="form-control" id="pwd" name ="password" placeholder="Enter password">
						    </div>
						    <button type="submit" class="btn btn-default">Submit</button>
					  	</form>
					</div>
				</div>		
				<a href ="logout" id ="logout"><i class="material-icons">power_settings_new</i></a>
	    </div>
	
	    <div class="full-bg" style="background-image: url(Images/bg1.jpg)">
	
			<section class="timeline">
				<ul>
					<li>
				    	<div>
				      		<time>1833</time>  
				        	<img src="Images/Alfred_Nobel/Alfred_Nobel_1.jpg" alt="Alfred Nobel">
				        	<br />
				        	<a href ="Content/Alfred_Nobel.html" class="btn btn-primary">Read More</a>     
				    	</div>
				  	</li>
				  	<li>
				    	<div>
				      		<time>1903</time> 
				        	<img src="Images/Marie_Curie/Marie_Curie.jpg" alt="Marie Curie">
				        	<br />
				        	<a href ="Content/Marie_Curie.html" class="btn btn-primary">Read More</a>
				    	</div>
				  	</li>
				  	<li>
				    	<div>
				      		<time>1921</time> 
				        	<img src="Images/Albert_Einstein/Einstein.jpeg" alt="Albert Einstein">
				        	<br />
				        	<a href ="Content/Albert_Einstein.html" class="btn btn-primary">Read More</a>
				    	</div>
				  	</li>
				  		
				  	<li>
				    	<div>
				      		<time>1932</time> 
				      		<img src="Images/Werner_Heisenberg/Werner_Heisenberg.jpg" alt="Werner Heisenberg">
				        	<br />
				        	<a href ="Content/Werner_Heisenberg.html" class="btn btn-primary">Read More</a>
				    	</div>
				  	</li>
				  	<li>
				    	<div>
				      		<time>1962</time> 
				    		<img src="Images/Linus_Pauling/Linus_Pauling.jpg" alt="Linus Pauling">
				        	<br />
				        	<a href ="Content/Linus_Pauling.html" class="btn btn-primary">Read More</a>
				    	</div>
				  	</li>
				  	<li>
				    	<div>
				      		<time>1964</time> 
				        	<img src="Images/Jean_Paul_Sartre/Jean_Paul_Sartre.jpg" alt="Jean Paul Sartre">
				        	<br />
			        		<a href ="Content/Jean_Paul_Sartre.html" class="btn btn-primary">Read More</a>
				    	</div>
				  	</li>
				  	<li>
				    	<div>
				      		<time>1964</time> 
				        	<img src="Images/Martin_Luther_King/Martin_Luther_King.jpg" alt="Martin Luther King">
				        	<br />
				        	<a href ="Content/Martin_Luther_King.html" class="btn btn-primary">Read More</a>
				    	</div>
				  	</li>
				  	<li>
				    	<div>
				      		<time>1979</time> 
				    		<img src="Images/Mother_Teresa/Mother_Teresa.jpg" alt="Mother Teresa">
				        	<br />
				        	<a href ="Content/Mother_Teresa.html" class="btn btn-primary">Read More</a>
				    	</div>
				  	</li>
				  	<li>
				  		<div>
				      		<time>1989</time> 
				    		<img src="Images/Tenzin_Gyatso/Tenzin_Gyatso.jpg" alt="Tenzin Gyatso">
				        	<br />
				        	<a href ="Content/Tenzin_Gyatso.html" class="btn btn-primary">Read More</a>
				    	</div>
				  	</li>
				  	<li>
				    	<div>
				      		<time>1993</time> 
				    		<img src="Images/Nelson_Mandela/Nelson_Mandela.jpeg" alt="Nelson Mandela">
				        	<br />
				        	<a href ="Content/Nelson_Mandela.html" class="btn btn-primary">Read More</a>
				    	</div>
				  	</li>
				  
				</ul>
			</section>
	    </div> 
	
	    <footer class="footer-basic-centered">
			<p class="footer-company-motto">Timeline nobel prizes.</p>
			<p class="footer-links">
				<a href="#">Home</a>
			</p>
			
			<p class="footer-company-name">Colin Frapper &copy; 2017</p>
	
	    </footer>
	    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
	    <script src="Js/main.js" type="text/javascript"></script>
	        
	    <script>
	    /**
	 		@role : open the register panel
	    **/
	    function open_panel_register() 
	    {
		    slideItRegister();
		    var a = document.getElementById("sidebar_register");
		    a.setAttribute("id", "sidebar1Register");
		    a.setAttribute("onclick", "close_panel_register()");
	    }
	
	    /**
	    	@role : open the login panel 
	    **/
	    function open_panel_login() 
	    {
			slideItLogin();
			var a = document.getElementById("sidebar_login");
			a.setAttribute("id", "sidebar1Login");
			a.setAttribute("onclick", "close_panel_login()");
	    }
	
	
	    /**
			@role : slide the register bar
		**/
	    function slideItRegister() 
	    {
		    var slidingDiv = document.getElementById("slider_register");
		    var stopPosition = 0;
		    if (parseInt(slidingDiv.style.right) < stopPosition) 
			{
			    slidingDiv.style.right = parseInt(slidingDiv.style.right) + 2 + "px";
			    setTimeout(slideItRegister, 1);
	    	}
	    }
	
	    /**
			@role : slide the login bar
		**/
	
	    function slideItLogin() 
	    {
	        var slidingDiv = document.getElementById("slider_login");
	        var stopPosition = 0;
	        if (parseInt(slidingDiv.style.right) < stopPosition) 
	        {
		        slidingDiv.style.right = parseInt(slidingDiv.style.right) + 2 + "px";
		        setTimeout(slideItLogin, 1);
	        }
	    }
	
	
	    
	    /**
			@role : close the register bar
		**/
	    function close_panel_register() 
	    {
		    slideInRegister();
		    a = document.getElementById("sidebar1Register");
		    a.setAttribute("id", "sidebar_register");
		    a.setAttribute("onclick", "open_panel_register()");
	    }
	
	    
	    /**
			@role : close the login bar
		**/
	    function close_panel_login() 
	    {
	        slideInLogin();
	        a = document.getElementById("sidebar1Login");
	        a.setAttribute("id", "sidebar_login");
	        a.setAttribute("onclick", "open_panel_login()");
	    }
	
	
	    
	    /**
			@role : slide in the register bar
		**/
	    function slideInRegister() 
	    {
		    var slidingDiv = document.getElementById("slider_register");
		    var stopPosition = -342;
		    if (parseInt(slidingDiv.style.right) > stopPosition) 
			{
			    slidingDiv.style.right = parseInt(slidingDiv.style.right) - 2 + "px";
			    setTimeout(slideInRegister, 1);
	    	}
	    }
	
	    /**
			@role : slide in the login bar
		**/
	    function slideInLogin() 
	    {
	        var slidingDiv = document.getElementById("slider_login");
	        var stopPosition = -342;
	        if (parseInt(slidingDiv.style.right) > stopPosition) 
	        {
		        slidingDiv.style.right = parseInt(slidingDiv.style.right) - 2 + "px";
		        setTimeout(slideInLogin, 1);
	        }
	     }
	    
	    </script>
	</body>
</html>