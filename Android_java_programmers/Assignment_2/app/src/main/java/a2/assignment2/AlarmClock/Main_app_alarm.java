package a2.assignment2.AlarmClock;

import a2.assignment2.R;
import java.text.SimpleDateFormat;
import android.view.View;
import android.view.ViewGroup;
import android.view.ContextMenu.ContextMenuInfo;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.TextView;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.view.ContextMenu;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import android.os.Bundle;
import android.app.Activity;


/**
 * @author Colin FRAPPER
 * @date 24/09/2016
 */

public class Main_app_alarm extends Activity
{

	private DataSource data_source;
	private List<Alarm> alarm_values;
	private MyAdapter my_adapt;
	private AlarmManager alarm_manager;
	private TextView setTime;
	private ListView list_view;

	/**
	 * @param savedInstanceState
     */
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		data_source = new DataSource(this);
		data_source.open();

		setContentView(R.layout.alarm);

		setTime = (TextView) findViewById(R.id.currentTime);
		setTime.setText(getCurrentTime());

		alarm_values = data_source.getListAlarm();
		my_adapt = new MyAdapter(this, R.layout.alarm_row, alarm_values);
		list_view = (ListView) findViewById(R.id.list);
		TextView txt1 = (TextView) findViewById(R.id.empty);
		list_view.setEmptyView(txt1);
		list_view.setAdapter(my_adapt);
		registerForContextMenu(list_view);


		Intent connectionIntent = new Intent(this, AddAlarm.class);
		this.startService(connectionIntent); // connection to service

	}


	protected void onResume()
	{
		super.onResume();
		Thread th = new Thread()
		{
			@Override
			public void run()
			{
				try
				{
					while (!isInterrupted())
					{
						Thread.sleep(5000); // every 5 seconds for display the time

						runOnUiThread(new Runnable()
						{
							public void run()
							{
								setTime.setText(getCurrentTime());
							}
						});
					}
				} catch (InterruptedException e) {
				}
			}
		};
		th.start();
	}

	/**
	 *
	 * @param menu
	 * @return boolean
     */
	public boolean onCreateOptionsMenu(Menu menu)
	{
		getMenuInflater().inflate(R.menu.menu_alarm, menu);
		return true;
	}

	/**
	 *
	 * @param menu
	 * @param view
	 * @param menuInfo
     */
	public void onCreateContextMenu(ContextMenu menu, View view, ContextMenuInfo menuInfo)
	{
		super.onCreateContextMenu(menu, view, menuInfo);
		if (view.getId() == R.id.list)
		{
			AdapterView.AdapterContextMenuInfo information = (AdapterView.AdapterContextMenuInfo) menuInfo;
			menu.setHeaderTitle("" + alarm_values.get(information.position).getHour().toString()
					               + " : "
						           + alarm_values.get(information.position).getMinute().toString());
			menu.add(1, 1, 1, getResources().getString(R.string.update));
			menu.add(2, 2, 2, getResources().getString(R.string.delete));
			if (!alarm_values.get(information.position).isActive())
			{
				menu.add(3, 3, 3,  getResources().getString(R.string.activate));

			}
			else
			{
				menu.add(4, 4, 4, getResources().getString(R.string.desactivate));

			}
		}
	}

	/**
	 *
	 * @param item
	 * @return boolean
     */
	public boolean onContextItemSelected(MenuItem item)
	{
		AdapterView.AdapterContextMenuInfo info = (AdapterView.AdapterContextMenuInfo) item.getMenuInfo();
		switch (item.getItemId())
		{
			case 1: // update alarm
				Alarm alarm1 = alarm_values.get(info.position);
				my_adapt.remove(alarm1);
				Intent intent = new Intent(this, EditAlarm.class);
				intent.putExtra("alarm_1", alarm1);
				AlarmUnregister(alarm1);
				this.startActivityForResult(intent, 0);
				break;
			case 2: // delete alarm
				Alarm alarm2 = alarm_values.get(info.position);
				data_source.DeleteAlarm(alarm2);
				my_adapt.remove(alarm2);
				AlarmUnregister(alarm2);
				my_adapt.remove(alarm2);
				break;

			case 3: // activate alarm
				Alarm alarm3 = alarm_values.get(info.position);
				if (alarm3.isActive())
				{
					break;
				}
				else
				{
					alarm3.setActive(true);
					data_source.UpdateAlarm(alarm3.getId(), alarm3.getHour(), alarm3.getMinute(), 1);
					AlarmRegister(alarm3);
					my_adapt.notifyDataSetChanged();
				}
				break;
			case 4: // desactivate alarm
				Alarm alarm4 = alarm_values.get(info.position);
				if (!alarm4.isActive())
				{
					break;
				}
				else
				{
					alarm4.setActive(false);
					data_source.UpdateAlarm(alarm4.getId(), alarm4.getHour(), alarm4.getMinute(), 0);
					AlarmUnregister(alarm4);
					my_adapt.notifyDataSetChanged();
				}
				break;
		}
		return true;
	}

	/**
	 * @param requestCode
	 * @param resultCode
	 * @param result
     */
	public void onActivityResult(int requestCode, int resultCode, Intent result)
	{
		switch (requestCode)
		{
			case 0:
				if (resultCode == RESULT_OK)
				{
					Alarm alarm = (Alarm) result.getSerializableExtra("alarm_1");
					boolean a = alarm.isActive();
					int active;
					if (a)
					{
						active = 1;
						AlarmRegister(alarm);
					}
					else
					{
						active = 0;
					}
					data_source.open();
					data_source.UpdateAlarm(alarm.getId(), alarm.getHour(), alarm.getMinute(), active);
					data_source.close();

					my_adapt.add(alarm);
					my_adapt.notifyDataSetChanged(); // save the data

				}
				break;
			case 1:
				if (resultCode == RESULT_OK)
				{
					Alarm al = (Alarm) result.getSerializableExtra("alarm_1");
					my_adapt.add(al);
					my_adapt.notifyDataSetChanged(); // sava the data
					AlarmRegister(al);
				}
				break;
		}
	}

	/**
	 *
	 * @param view
     */
	public void CreateAlarm(View view)
	{
		Intent intent = new Intent(this, AddAlarm.class);
		startActivityForResult(intent, 1);
	}

	/**
	 *
	 * @param al
     */
	protected void AlarmUnregister(Alarm al)
	{
		Intent intent = new Intent(this, ReceiverAlarm.class);
		intent.putExtra("alarm_1", al);
		PendingIntent pend = PendingIntent.getBroadcast(this, al.getId(), intent, PendingIntent.FLAG_UPDATE_CURRENT);
		if (alarm_manager == null)
		{
			alarm_manager = (AlarmManager) getSystemService(ALARM_SERVICE);
		}
		alarm_manager.cancel(pend);
	}


	/**
	 *
	 * @param al
     */
	protected void AlarmRegister(Alarm al)
	{
		if (al.isActive())
		{
			int hour = Integer.parseInt(al.getHour());
			int min = Integer.parseInt(al.getMinute());
			Calendar calendar = Calendar.getInstance();
			calendar.set(Calendar.HOUR_OF_DAY, hour);
			calendar.set(Calendar.MINUTE, min);
			calendar.set(Calendar.SECOND, 0);
			long time = calendar.getTimeInMillis();
			Intent intent = new Intent(this, ReceiverAlarm.class);
			intent.putExtra("alarm_1", al);
			PendingIntent pend = PendingIntent.getBroadcast(this, al.getId(), intent, PendingIntent.FLAG_CANCEL_CURRENT);
			alarm_manager = (AlarmManager) getSystemService(ALARM_SERVICE);
			alarm_manager.set(AlarmManager.RTC_WAKEUP, time, pend);
		}
	}


	/**
	 * @return d (currentTime)
     */
	public String getCurrentTime()
	{
		Date date = new Date();
		SimpleDateFormat simple_date = new SimpleDateFormat("HH:mm:ss");
		String d = simple_date.format(date);
		return d;
	}

	/**
	 * Adapter to displa Alarm-List
	 */
	@SuppressWarnings("deprecation")
	public class MyAdapter extends ArrayAdapter<Alarm>
	{
		/**
		 * @param cont
		 * @param res
         * @param ListOfAlarm
         */
		public MyAdapter(Context cont, int res, List<Alarm> ListOfAlarm)
		{
			super(cont, res, ListOfAlarm);
		}

		/**
		 * @role : // Called when updating the ListView
		 * @param pos
		 * @param convertView
		 * @param parent
         * @return row_alarm
         */
		public View getView(int pos, View convertView, ViewGroup parent)
		{
			Alarm alarm = getItem(pos);
			View row_alarm;
			if (convertView == null)
			{
				LayoutInflater inflater = getLayoutInflater();
				row_alarm = inflater.inflate(R.layout.alarm_row, parent, false);
			}
			else
			{
				row_alarm = convertView;
			}
			TextView MinuteView = (TextView) row_alarm.findViewById(R.id.display_minute);
			TextView HourView = (TextView) row_alarm.findViewById(R.id.display_hour);
			TextView div = (TextView) row_alarm.findViewById(R.id.sep_time);
			MinuteView.setText(alarm_values.get(pos).getMinute());
			HourView.setText("" + alarm_values.get(pos).getHour());
			if (alarm.isActive())
			{
				HourView.setTextColor(getResources().getColor(R.color.green));
				div.setTextColor(getResources().getColor(R.color.green));
				MinuteView.setTextColor(getResources().getColor(R.color.green));
			}
			else
			{
				MinuteView.setTextColor(getResources().getColor(R.color.blue));
				HourView.setTextColor(getResources().getColor(R.color.blue));
				div.setTextColor(getResources().getColor(R.color.blue));
			}
			return row_alarm;
		}
	}
}
