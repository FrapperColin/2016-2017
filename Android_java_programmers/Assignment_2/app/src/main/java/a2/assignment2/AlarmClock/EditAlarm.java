package a2.assignment2.AlarmClock;

import java.text.SimpleDateFormat;
import java.util.Date;

import a2.assignment2.R;
import android.os.Bundle;
import android.content.Intent;
import android.view.Menu;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.TimePicker;
import android.app.Activity;

/**
 * @author Colin FRAPPER
 * @date 24/09/2016
 */

public class EditAlarm extends Activity
{
	private TimePicker time_p;
	private TextView display_time;
	private Alarm alarm;

	@SuppressWarnings("deprecation")

	/**
	 * @param savedInstanceState
	 */
	protected void onCreate(Bundle savedInstanceState)
	{
		super.onCreate(savedInstanceState);
		setContentView(R.layout.add_alarm);
		time_p = (TimePicker) findViewById(R.id.time_pick);
		Intent intent = getIntent();
		alarm = (Alarm) intent.getSerializableExtra("alarm_1");
		String hour = alarm.getHour();
		String minute = alarm.getMinute();
		display_time = (TextView) findViewById(R.id.currTime);
		display_time.setText(getCurrentTime());
		time_p.setCurrentHour(Integer.parseInt(hour));
		time_p.setCurrentMinute(Integer.parseInt(minute));
		time_p.setIs24HourView(true);

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
		t.start();
		Button button = (Button) findViewById(R.id.setAlarm);
		button.setOnClickListener(new View.OnClickListener()
		{
			public void onClick(View v)
			{
				int hour = (time_p.getCurrentHour());
				int minute = (time_p.getCurrentMinute());
				alarm.setHour(String.valueOf(hour));
				alarm.setMinute(String.valueOf(minute));
				setAlarm(alarm);
			}
		});
	}

	/**
	 * @param menu
	 */
	public boolean onCreateOptionsMenu(Menu menu)
	{
		getMenuInflater().inflate(R.menu.add_alarm_menu, menu);
		return true;
	}

	/**
	 *
	 * @param alarm
     */
	public void setAlarm(Alarm alarm)
	{
		Intent rep = new Intent();
		rep.putExtra("alarm_1", alarm);
		setResult(RESULT_OK, rep);
		finish();
	}

	/**
	 * @role : return current time in string format
	 * @return string
	 */
	public String getCurrentTime()
	{
		Date date = new Date();
		SimpleDateFormat simple_date = new SimpleDateFormat("HH:mm:ss");
		String d = simple_date.format(date);
		return d;
	}
}
