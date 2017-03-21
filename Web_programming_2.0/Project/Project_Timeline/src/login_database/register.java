package login_database;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/register")
public class register extends HttpServlet 
{
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String dbURL = "jdbc:mysql://localhost:3306/timeline";
    private String dbUser = "root";
    private String dbPass = "1234";
    private String driver = "com.mysql.jdbc.Driver" ;
    
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		String email = request.getParameter("email");
		String username = request.getParameter("username");
		String password = request.getParameter("password");
		if(username == "" || password == "" || email =="")
		{
			System.out.println("Error please fill the form");
		}
		else
		{
			Connection conn = null; 
		    try 
		    {
		    	Class.forName(driver);
		    	conn = DriverManager.getConnection(dbURL, dbUser, dbPass);
		
		    	// constructs SQL statement
		         String query = "INSERT INTO login (email,username,pass) values (?,?,?)";
		         PreparedStatement statement = conn.prepareStatement(query);
		         statement.setString(1, email);
		         statement.setString(2, username);
		         statement.setString(3, password);          
		    	
		         int row = statement.executeUpdate();
		        
			     if (row > 0) 
			     {
			    	 System.out.println("Insert");   
			     }
		         else
		         {
		        	 System.out.println("Error not insert ");
		         }
		    }
		    catch (SQLException ex) 
		    {
		        ex.printStackTrace();
		    } 
		    catch (ClassNotFoundException e) 
		    {
				e.printStackTrace();
			} 
		    finally 
		    {
		        if (conn != null) 
		        {
		            try 
		            {
		                conn.close();
		            } 
		            catch (SQLException ex) 
		            {
		                ex.printStackTrace();
		            }
		        }
		        response.sendRedirect("./index.jsp");
		        // forwards to the message page
		        //getServletContext().getRequestDispatcher("/index.jsp").forward(request, response);
		    }
		}
}
}