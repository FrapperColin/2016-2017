package a2.assignment2.AlarmClock;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.util.Log;

/**
 * @author Colin FRAPPER
 * @date 24/09/2016
 */

public class DbHelper extends SQLiteOpenHelper
{
	public static final String TABLE_NAME = "alarms";
	public static final String COLUMN_ID = "_id";
	public static final String COLUMN_HOUR = "hour";
	public static final String COLUMN_MINUTE = "minute";
	public static final String COLUMN_ACTIVE = "active";
	public SQLiteDatabase SQL_database;

	private static final String DATABASE_NAME = "alarms.db";
	private static final int DATABASE_VERSION = 10;

	private static final String DATABASE_CREATE = "create table " + TABLE_NAME
												+ " (" + COLUMN_ID + " integer primary key autoincrement, "
												+ COLUMN_HOUR + " integer, "
												+ COLUMN_MINUTE + " integer, "
												+ COLUMN_ACTIVE + " integer);";

	/**
	 *
	 * @param cont
     */
	public DbHelper(Context cont)
	{
		super(cont, DATABASE_NAME, null, DATABASE_VERSION);
	}

	/**
	 *
	 * @param SQL_DB
     */
	public void onCreate(SQLiteDatabase SQL_DB)
	{
		SQL_database = SQL_DB;
		SQL_DB.execSQL(DATABASE_CREATE);
	}

	/**
	 * @role : Update database
	 * @param SQL_DB
	 * @param oldV
	 * @param newV
     */
	public void onUpgrade(SQLiteDatabase SQL_DB, int oldV, int newV)
	{
		Log.w(DbHelper.class.getName(), "Database will be update from version " + oldV + " to "
				+ newV + ", the old data will be destroy after this.");
		SQL_DB.execSQL("DROP TABLE " + TABLE_NAME);
		onCreate(SQL_DB);
	}

	/**
	 * @role : If it's open or not
	 * @return boolean
	 */
	public boolean isOpen()
	{
		if (SQL_database != null)
		{
			return SQL_database.isOpen();
		}
		else
		{
			return false;
		}
	}

}
