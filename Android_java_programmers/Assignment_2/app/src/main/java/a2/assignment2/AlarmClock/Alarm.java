package a2.assignment2.AlarmClock;

import java.io.Serializable;

/**
 * @author Colin FRAPPER
 * @date 24/09/2016
 */

public class Alarm implements Serializable
{
	private static final long serialVersionUID = 42L;
	private int id;
	private String minute;
	private String hour;
	private boolean IS_ACTIVE;

	/**
	 * getter
	 * @return id
     */
	public int getId()
	{
		return id;
	}

	/**
	 * setter
	 * @param id
     */
	public void setId(int id)
	{
		this.id = id;
	}

	/**
	 * getter
	 * @return minute
     */
	public String getMinute()
	{
		return minute;
	}

	/**
	 * setteur
	 * @param minute
     */
	public void setMinute(String minute)
	{
		if (minute.length() < 2) // Case before ..:10
		{
			this.minute = "0" + minute;
		}
		else
		{
			this.minute = minute;
		}
	}

	/**
	 * getter
	 * @return hour
     */
	public String getHour()
	{
		return hour;
	}

	/**
	 * setter
	 * @param hour
     */
	public void setHour(String hour)
	{
		if (hour.length() < 2) // Case before 10:..
		{
			this.hour = "0" + hour;
		}
		else
		{
			this.hour = hour;
		}
	}

	/**
	 * getter
	 * @return IS_ACTIVE
     */
	public boolean isActive()
	{
		return IS_ACTIVE;
	}

	/**
	 * setter
	 * @param active
     */
	public void setActive(boolean active)
	{
		this.IS_ACTIVE = active;
	}

}
