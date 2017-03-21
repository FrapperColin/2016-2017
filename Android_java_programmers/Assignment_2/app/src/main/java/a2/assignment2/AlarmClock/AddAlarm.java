package a2.assignment2.AlarmClock;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

import a2.assignment2.R;

import android.os.Bundle;
import android.content.Intent;
import android.view.Menu;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.TimePicker;
import android.widget.Toast;
import android.app.Activity;


/**
 * @author Colin FRAPPER
 * @date 24/09/2016
 * @role Class for add a new menu_alarm
 */

public class AddAlarm extends Activity
{
	private TimePicker time_p;
	private TextView display_time;
	private DataSource date_source;

	@SuppressWarnings("deprecation")
	/**
	 * @param : Bundle savedInstanceState
	 */
	protected void onCreate(Bundle savedInstanceState)
	{
		super.onCreate(savedInstanceState);
		setContentView(R.layout.add_alarm);

		date_source = new DataSource(this);

		display_time = (TextView) findViewById(R.id.currTime);
		display_time.setText(getCurrentTime());


		Thread t = new Thread()
		{
			public void run()
			{
				try
				{
					while (!isInterrupted())
					{
						Thread.sleep(5000);  // every 5 seconds for display the time
						runOnUiThread(new Runnable()
						{
							public void run()
							{
								display_time.setText(getCurrentTime());
							}
						});
					}
				} catch (InterruptedException e) {
				}
			}
		};

		time_p = (TimePicker) findViewById(R.id.time_pick);
		time_p.setIs24HourView(true);
		time_p.setCurrentHour(0);
		time_p.setCurrentMinute(0);

		t.start();
		Button button = (Button) findViewById(R.id.setAlarm);
		button.setOnClickListener(new View.OnClickListener()
		{
			public void onClick(View v) // click on New Alarm
			{
				int minute = (time_p.getCurrentMinute());
				int hour = (time_p.getCurrentHour());
				long diff = TimeDifference(hour, minute);
				date_source.open();
				Alarm al = date_source.InsertNewAlarm(hour, minute); // add alarm to the database
				date_source.close(); // close
				Display_toasts(diff); // Display toast
				ReplyContent(al);
			}
		});
	}

	/**
	 * @param : int h
	 * @param : int m
	 */
	protected long TimeDifference(int h, int m)
	{
		long difference;
		Calendar calendar1 = GregorianCalendar.getInstance(); // Date for Alarm
		Calendar calendar2 = GregorianCalendar.getInstance(); // Date now
		calendar1.set(Calendar.HOUR_OF_DAY, h); // setting hour of Alarm
		calendar1.set(Calendar.MINUTE, m);// setting minute of Alarm
		if (calendar1.before(calendar2)) // if alarm set day to next
		{
			calendar1.set(Calendar.DAY_OF_YEAR, (calendar1.get(Calendar.DAY_OF_YEAR) + 1));
		}
		difference = calendar1.getTimeInMillis() - calendar2.getTimeInMillis();
		return difference;
	}


	/**
	 * @param : Alarm al
	 */
	protected void ReplyContent(Alarm al)
	{
		Intent rep = new Intent();
		rep.putExtra("alarm_1", al);
		setResult(RESULT_OK, rep);
		finish();
	}

	/**
	 * @param : long diffrence
	 */
	protected void Display_toasts(long difference)
	{
		long hour;
		long minute;
		long second;
		long days;
		hour = (difference % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000);
		minute = (difference % (60 * 60 * 1000)) / (60 * 1000);
		second = (difference % (60 * 1000)) / (1000);
		days = difference / (24 * 60 * 60 * 1000);
		if (days > 0)
		{
			Toast.makeText(AddAlarm.this, "Alarm will be off in " + days + "days, " + hour + " hours, " + minute + "minutes and " + second + "seconds.", Toast.LENGTH_LONG).show();
		}
		else if (hour > 0)
		{
			Toast.makeText(AddAlarm.this, "Alarm will be off in " + hour + " hours, " + minute + "minutes and " + second + "seconds.", Toast.LENGTH_LONG).show();
		}
		else if (minute > 0)
		{
			Toast.makeText(AddAlarm.this, "Alarm will be off in " + minute + " minutes and " + second + "seconds.", Toast.LENGTH_LONG).show();
		} else
		{
			Toast.makeText(AddAlarm.this, "Alarm will be off in " + second + " seconds", Toast.LENGTH_LONG).show();
		}
	}



	/**
	 * @param : Menu menu
	 */
	public boolean onCreateOptionsMenu(Menu menu)
	{
		getMenuInflater().inflate(R.menu.add_alarm_menu, menu);
		return true;
	}


	/**
	 * @return : current time in string format
	 */
	public String getCurrentTime()
	{
		Date date = new Date();
		SimpleDateFormat simple_date = new SimpleDateFormat("HH:mm:ss");
		String d = simple_date.format(date);
		return d;
	}
}
