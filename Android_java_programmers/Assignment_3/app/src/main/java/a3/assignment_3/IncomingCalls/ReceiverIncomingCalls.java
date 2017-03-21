package a3.assignment_3.IncomingCalls;

/**
 * @author Colin FRAPPER
 * @date 24/10/2016
 */

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.telephony.TelephonyManager;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

public class ReceiverIncomingCalls extends BroadcastReceiver
{

	private DataSource ds;
	private String d;

	public void onReceive(Context context, Intent intent)
	{
		Call call = null;
		Bundle bundle = intent.getExtras();
		String state = bundle.getString(TelephonyManager.EXTRA_STATE);

		if (state.equalsIgnoreCase(TelephonyManager.EXTRA_STATE_RINGING))
		{
			String number = bundle.getString(TelephonyManager.EXTRA_INCOMING_NUMBER);
			ds = new DataSource(context);
			ds.open();
			Date date = new Date();
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			d = sdf.format(date);
			List<Call> allCalls = ds.getAllCalls();
			// if number already exists only update date of call
			// no duplicate entries in case of one number calling twice
			for (Call c : allCalls)
			{
				if (c.getNumber().equalsIgnoreCase(number))
				{
					ds.deleteCall(c);
				}
			}
			call = ds.addCall(d, number);
			// update listview with new call
			Call_activity.updateListView(call);
		}
	}
}
