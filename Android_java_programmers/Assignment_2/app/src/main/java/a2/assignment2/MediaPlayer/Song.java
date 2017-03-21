package a2.assignment2.MediaPlayer;



/**
 * @author Colin FRAPPER
 * @date 24/09/2016
 */

public class Song
{

	private String title;
	private String path;

	/**
	 * @role : getter
	 * @return : title
	 */
	public String getTitle()
	{
		return title;
	}

	/**
	 * @role : setter
	 * @param title
	 */
	public void setTitle(String title)
	{
		this.title = title;
	}

	/**
	 * @role : getter
	 * @return the path
	 */
	public String getPath()
	{
		return path;
	}

	/**
	 * @role : setter
	 * @param path
	 */
	public void setPath(String path)
	{
		this.path = path;
	}

}
