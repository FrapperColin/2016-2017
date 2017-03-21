package login_database;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
 
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class login
 */
@WebServlet("/login")
public class login extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	// database connection settings
    private String dbURL = "jdbc:mysql://localhost:3306/timeline";
    private String dbUser = "root";
    private String dbPass = "1234";
    private String driver = "com.mysql.jdbc.Driver" ;
    
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
          
		// read form fields
		String username = request.getParameter("username");
		String password = request.getParameter("password");
		String message = null ; 
	    if(username == "" || password == "")
	    {
	    	message = "Wrong password or username" ;
	    }
	    else
	    {
	        Connection conn = null; // connection to the database
	        try 
	        {
	        	Class.forName(driver);
	        	conn = DriverManager.getConnection(dbURL, dbUser, dbPass);
	 
	        	String query ="select * from login where username = ? and pass = ? " ;
	        	PreparedStatement statement = conn.prepareStatement(query);
	            statement.setString(1, username);
	            statement.setString(2, password);
	            ResultSet rs = statement.executeQuery();
	            
	            if (!rs.next()) 
	            {
	            	System.out.println("result set does not data");
	            	message = "Wrong password or username" ;
	            } 
	            else 
	            {
	                System.out.println("resultset has a data");
	               
	    	    	message = "Welcome "+ username ;
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
	            
	            request.setAttribute("Message", message);
	            // forwards to the message page
	            getServletContext().getRequestDispatcher("/index.jsp").forward(request, response);

	        }
	    }
	        
	    }
}
