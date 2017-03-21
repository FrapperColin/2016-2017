package login_database;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebServlet("/logout")
public class logout extends HttpServlet 
{
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	
    
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		String message = "Disconnected" ;
        HttpSession session=request.getSession();  
        System.out.println("HELLO " + session);
        session.invalidate();  
        request.setAttribute("Message", message);
        // forwards to the message page
        getServletContext().getRequestDispatcher("/index.jsp").forward(request, response);
        
	}
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		doPost(request,response);
	}
}
	        
 
