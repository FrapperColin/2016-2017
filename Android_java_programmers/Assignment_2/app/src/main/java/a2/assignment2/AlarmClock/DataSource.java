package a2.assignment2.AlarmClock;

import java.util.ArrayList;
import java.util.List;
import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.SQLException;
import android.database.sqlite.SQLiteDatabase;


/**
 * @author Colin FRAPPER
 * @date 24/09/2016
 */

public class DataSource
{

	private SQLiteDatabase database;
	private DbHelper dbHelper;
	private String[] allColumns = {DbHelper.COLUMN_ID, DbHelper.COLUMN_HOUR, DbHelper.COLUMN_MINUTE, DbHelper.COLUMN_ACTIVE};

	/**
	 * @param cont
     */
	public DataSource(Context cont)
	{
		dbHelper = new DbHelper(cont);
	}

	/**
	 * @throws SQLException
     */
	public void open() throws SQLException
	{
		if (dbHelper != null && !dbHelper.isOpen())
		{
			database = dbHelper.getWritableDatabase();
		}
	}

	/**
	 * close dbHelper
	 */
	public void close()
	{
		if (dbHelper != null && dbHelper.isOpen())
		{
			dbHelper.close();
		}
	}

	/**
	 * getter : get Alarm depends on id
	 * @param id
	 * @return Alarm
     */
	public Alarm getAlarm(long id)
	{
		String getStringId = DbHelper.COLUMN_ID + "=" + id;
		open();
		Cursor cur = database.query(true, DbHelper.TABLE_NAME, allColumns, getStringId, null, null, null, null, null);
		if (cur != null && cur.getCount() > 0)
		{
			cur.moveToFirst();
			Alarm al = cursor_Alarm(cur);
			return al;
		}
		cur.close();
		close();
		return null;
	}

	/**
	 * @role : insert a new alarm in the database
	 * @param h
	 * @param min
     * @return Alarm
     */
	public Alarm InsertNewAlarm(int h, int min)
	{
		ContentValues values = new ContentValues();
		values.put(DbHelper.COLUMN_HOUR, h);
		values.put(DbHelper.COLUMN_MINUTE, min);
		values.put(DbHelper.COLUMN_ACTIVE, 1);
		open();
		long insertion = database.insert(DbHelper.TABLE_NAME, null, values);
		Cursor cursor = database.query(DbHelper.TABLE_NAME, allColumns, DbHelper.COLUMN_ID + " = " + insertion, null, null, null, null);
		cursor.moveToFirst();
		Alarm NewAlarm = cursor_Alarm(cursor);
		cursor.close();
		close();
		return NewAlarm;
	}

	/**
	 * @role : Delete Alarm
	 * @param al
     */
	public void DeleteAlarm(Alarm al)
	{
		long id = al.getId();
		open();
		database.delete(DbHelper.TABLE_NAME, DbHelper.COLUMN_ID + " = " + id, null);
		close();
	}

	/**
	 * @role Update the alarm
	 * @param id
	 * @param h
	 * @param m
	 * @param act
     * @return boolean
     */
	public boolean UpdateAlarm(long id, String h, String m, int act)
	{
		ContentValues args = new ContentValues();
		args.put(DbHelper.COLUMN_HOUR, Integer.valueOf(h));
		args.put(DbHelper.COLUMN_MINUTE, Integer.valueOf(m));
		args.put(DbHelper.COLUMN_ACTIVE, act);
		open();
		String getStringId = DbHelper.COLUMN_ID + "=" + id;
		boolean b = database.update(DbHelper.TABLE_NAME, args, getStringId, null) > 0;
		close();
		return b;
	}

	/**
	 * @role : get all the alarm of database
	 * @return alarms of database
	 */
	public List<Alarm> getListAlarm()
	{
		List<Alarm> list_alarms = new ArrayList<Alarm>();
		open();
		Cursor cur = database.query(DbHelper.TABLE_NAME, allColumns, null, null, null, null, null);
		cur.moveToFirst();
		while (!cur.isAfterLast())
		{
			Alarm al = cursor_Alarm(cur);
			list_alarms.add(al);
			cur.moveToNext();
		}
		cur.close(); // Make sure to close the cursor
		close();
		return list_alarms;
	}

	/**
	 * @role : return the alarm depends on the cursor
	 * @param cur
	 * @return a
     */
	private Alarm cursor_Alarm(Cursor cur)
	{
		Alarm a = new Alarm();
		a.setId(cur.getInt(0));
		a.setHour(String.valueOf(cur.getInt(1)));
		a.setMinute(String.valueOf(cur.getInt(2)));
		if (cur.getInt(3) == 0)
		{
			a.setActive(false);
		}
		else if (cur.getInt(3) == 1)
		{
			a.setActive(true);
		}
		return a;
	}
}
