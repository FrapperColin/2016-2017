package a2.assignment2.AlarmClock;


import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/**
 * @author Colin FRAPPER
 * @date 24/09/2016
 * @role Receiver for Alarms
 */

public class ReceiverAlarm extends BroadcastReceiver
{
	/**
	 * @param context
	 * @param intent
     */
	public void onReceive(Context context, Intent intent)
	{
		Alarm al = (Alarm) intent.getSerializableExtra("alarm_1");
		Intent in = new Intent(context, DialogAlarm.class);
		in.putExtra("alarm_1", al);
		in.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
		context.startActivity(in);

	}
}
