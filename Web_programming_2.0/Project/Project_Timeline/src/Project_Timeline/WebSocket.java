
package Project_Timeline;


import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import javax.websocket.CloseReason;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import org.jboss.logging.Logger;


@ServerEndpoint("/web")
public class WebSocket 
{
	Logger log = Logger.getLogger(this.getClass());

	private static final Set<Session> sessions = Collections.synchronizedSet(new HashSet<Session>());
	
	
	@OnMessage
	public void receiveMessage(String message, Session session) throws IOException {
	    
	    synchronized(sessions){
	      // Iterate over the connected sessions
	      // and broadcast the received message
	      for(Session client : sessions){
	        client.getBasicRemote().sendText(message);
	      }
	    }
	  }
	
	@OnOpen
	public void open(Session session) {
		log.info("Open session:" + session.getId());
		sessions.add(session);
	}
	
	@OnClose
	public void close(Session session, CloseReason c) {
		log.info("Closing:" + session.getId());
	    sessions.remove(session);
	}
	
	
}
