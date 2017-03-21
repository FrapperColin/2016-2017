package a3.assignment_3.IncomingCalls;


import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.SQLException;
import android.database.sqlite.SQLiteDatabase;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Colin FRAPPER
 * @date 24/10/2016
 */

public class DataSource
{
	// Database fields
	private SQLiteDatabase database;
	private DbHelper dbHelper;
	private String[] allColumns =
			{
				DbHelper.COLUMN_ID,
				DbHelper.COLUMN_DATE,
				DbHelper.COLUMN_NUMBER
			};

	public DataSource(Context context)
	{
		dbHelper = new DbHelper(context);
	}


	public void open() throws SQLException
	{
		database = dbHelper.getWritableDatabase();
	}

	/**
	 * Close database connection
	 */
	public void close()
	{
		dbHelper.close();
	}

	/**
	 * Add a new Call to database
	 */
	public Call addCall(String date, String number)
	{
		ContentValues values = new ContentValues();
		values.put(DbHelper.COLUMN_DATE, date); // Date of call
		values.put(DbHelper.COLUMN_NUMBER, number); // Phone Number
		long insertId = database.insert(DbHelper.TABLE_NAME, null, values);
		Cursor cursor = database.query(DbHelper.TABLE_NAME, allColumns, DbHelper.COLUMN_ID + " = " + insertId, null, null, null, null);
		cursor.moveToFirst();
		Call c = cursorToCall(cursor);
		cursor.close();
		return c;
	}

	/**
	 * Delete Call entry
	 */
	public void deleteCall(Call c)
	{
		long id = c.getId();
		database.delete(DbHelper.TABLE_NAME, DbHelper.COLUMN_ID + " = " + id, null);
	}

	/**
	 * @role Cursor to Call Here the new Call-object is created
	 * @param cursor
	 * @return
	 */
	private Call cursorToCall(Cursor cursor)
	{
		Call c = new Call();
		c.setId(cursor.getInt(0));
		c.setDate(cursor.getString(1));
		c.setNumber(cursor.getString(2));
		return c;
	}

	/**
	 * @role Returns all Calls currently saved in the database
	 * @return List of call
	 */
	public List<Call> getAllCalls()
	{
		List<Call> callList = new ArrayList<Call>();
		Cursor cursor = database.query(DbHelper.TABLE_NAME, allColumns, null, null, null, null, null);

		cursor.moveToFirst();
		while (!cursor.isAfterLast())
		{
			Call c = cursorToCall(cursor);
			callList.add(c);
			cursor.moveToNext();
		}
		cursor.close();
		return callList;
	}

}
