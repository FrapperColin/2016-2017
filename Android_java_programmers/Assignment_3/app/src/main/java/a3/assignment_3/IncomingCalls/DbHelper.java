package a3.assignment_3.IncomingCalls;

/**
 * @author Colin FRAPPER
 * @date 24/10/2016
 */
import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.util.Log;

public class DbHelper extends SQLiteOpenHelper
{

	public static final String TABLE_NAME = "calls";
	public static final String COLUMN_ID = "_id";
	public static final String COLUMN_DATE = "date";
	public static final String COLUMN_NUMBER = "number";

	private static final String DATABASE_NAME = "number.db";
	private static final int DATABASE_VERSION = 2;

	private static final String DATABASE_CREATE = "create table " + TABLE_NAME
											    + " (" + COLUMN_ID + " integer primary key autoincrement, "
												+ COLUMN_DATE + " text not null, "
												+ COLUMN_NUMBER + " text not null);";

	public DbHelper(Context context)
	{
		super(context, DATABASE_NAME, null, DATABASE_VERSION);
	}

	@Override
	public void onCreate(SQLiteDatabase db)
	{
		db.execSQL(DATABASE_CREATE);

	}

	@Override
	public void onUpgrade(SQLiteDatabase db, int oldV, int newV)
	{
		Log.w(DbHelper.class.getName(), "Database will be update from version " + oldV + " to "
				+ newV + ", the old data will be destroy after this.");
		db.execSQL("DROP TABLE " + TABLE_NAME);
		onCreate(db);
	}
}
