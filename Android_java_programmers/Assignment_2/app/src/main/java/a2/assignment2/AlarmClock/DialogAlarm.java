package a2.assignment2.AlarmClock;

import a2.assignment2.R;
import java.util.Calendar;
import android.content.Intent;
import android.app.PendingIntent;
import android.os.Bundle;
import android.app.AlarmManager;
import android.content.DialogInterface;
import android.app.AlertDialog;
import android.media.MediaPlayer;
import android.app.Activity;

/**
 * @author Colin FRAPPER
 * @date 24/09/2016
 */

public class DialogAlarm extends Activity
{

	private DataSource data_source; // Database

	/**
	 *
	 * @param savedInstanceState
     */
	protected void onCreate(Bundle savedInstanceState)
	{
		data_source = new DataSource(getApplicationContext());

		final MediaPlayer media_p = MediaPlayer.create(this, R.raw.sunday_church); // song for the alarm
		media_p.start();

		Intent intent = getIntent();
		final Alarm alarm1 = (Alarm) intent.getSerializableExtra("alarm_1");
		final int id = alarm1.getId();
		final Alarm alarm = data_source.getAlarm(id);
		final String hour = alarm.getHour();
		final String min = "" + (Integer.parseInt(alarm.getMinute()) + 5); // wait 5min

		if (alarm.isActive())
		{
			new AlertDialog.Builder(this)
					.setTitle(getResources().getString(R.string.alarm))
					.setMessage(getResources().getString(R.string.morning))
					.setPositiveButton(R.string.later_alarm, new DialogInterface.OnClickListener()
					{
						public void onClick(DialogInterface dialog, int init1)
						{
							alarm.setMinute(min);
							Intent receiver = new Intent(getApplicationContext(), ReceiverAlarm.class);
							receiver.putExtra("alarm_1", alarm);
							Calendar calendar1 = Calendar.getInstance();
							calendar1.set(Calendar.HOUR_OF_DAY, Integer.parseInt(hour));
							calendar1.set(Calendar.MINUTE, Integer.parseInt(min));
							long time = calendar1.getTimeInMillis();
							PendingIntent pend = PendingIntent.getBroadcast(getApplicationContext(), alarm.getId(), receiver, 0);
							AlarmManager alarm_manager = (AlarmManager) getSystemService(ALARM_SERVICE);
							alarm_manager.set(AlarmManager.RTC_WAKEUP, time, pend);
							media_p.stop();
							finish();
						}
					}).setNegativeButton(R.string.cancel, new DialogInterface.OnClickListener()
					{
						public void onClick(DialogInterface dialog, int which)
						{
							media_p.stop();
							finish();
						}
					}).setIcon(R.drawable.alarm).show();
					super.onCreate(savedInstanceState);
		}
		else
		{
			finish();
		}
	}

}
