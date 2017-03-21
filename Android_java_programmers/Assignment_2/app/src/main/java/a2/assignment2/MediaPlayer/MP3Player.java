package a2.assignment2.MediaPlayer;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import a2.assignment2.MainList;
import a2.assignment2.R;

import android.app.ActionBar;
import android.app.AlertDialog;
import android.view.ViewGroup;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.Bundle;
import android.os.Environment;
import android.os.IBinder;
import android.os.RemoteException;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View.OnClickListener;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemClickListener;
import android.widget.ArrayAdapter;
import android.widget.ImageButton;
import android.widget.ListView;
import android.widget.TextView;
import android.content.ComponentName;
import android.content.Context;
import android.content.DialogInterface;
import android.view.View;
import android.app.ListActivity;


/**
 * @author Colin FRAPPER
 * @date 24/09/2016
 */

public class MP3Player extends ListActivity
{

	private List<Song> listOfSong = new ArrayList<Song>();
	private ImageButton back;
	private ImageButton pause;
	private ImageButton next;
	private ImageButton play;
	private Song currSong;
	private MusicInterface mInterface;
	private ListView lv;
	private MyListAdapter adapter;
	private Intent connectionIntent;
	private static final String MEDIA_PATH = Environment.getExternalStorageDirectory().getPath();

	/**
	 * @param savedInstanceState
     */
	protected void onCreate(Bundle savedInstanceState)
	{
		super.onCreate(savedInstanceState);
		setContentView(R.layout.mp3_player);

		ActionBar ab = getActionBar();
		ab.setDisplayHomeAsUpEnabled(true);

		connectionIntent = new Intent(this, MusicService.class);
		this.startService(connectionIntent); // connect to service
		doBindService(connectionIntent);

	}

	/**
	 * @param in
     */
	private void doBindService(Intent in)
	{
		this.bindService(in, musicPlayerConnection, BIND_AUTO_CREATE);
	}

	/**
	 *
	 * @param menu
	 * @return boolean
     */
	public boolean onCreateOptionsMenu(Menu menu)
	{
		getMenuInflater().inflate(R.menu.mp3_player_menu, menu);
		return super.onCreateOptionsMenu(menu);
	}

	/**
	 * @role : create alerdialog to exit application, this is the only way service is destroyed.
	 * @param item
	 * @return
     */
	public boolean onOptionsItemSelected(MenuItem item)
	{
		switch (item.getItemId())
		{
			case R.id.exit_app:
				new AlertDialog.Builder(this)
						.setTitle(getResources().getString(R.string.exit_music_app))
						.setMessage(getResources().getString(R.string.dialog_exit))
						.setPositiveButton(android.R.string.yes, new DialogInterface.OnClickListener()
						{
							public void onClick(DialogInterface dialog, int which)
							{
								try
								{
									mInterface.stop();
								}
								catch (RemoteException e)
								{}
								destroyAll();
							}
						})
						.setNegativeButton(android.R.string.no, new DialogInterface.OnClickListener()
						{
							public void onClick(DialogInterface dialog, int which)
							{
								dialog.cancel();
							}
						}).show();
				break ;
			case R.id.menu:
				Intent intent = new Intent(this, MainList.class);
				startActivity(intent);
				break;
		}
		return super.onOptionsItemSelected(item);
	}

	/**
	 * @role : stop service
	 */
	protected void destroyAll()
	{
		onDestroy();
		unbindService(musicPlayerConnection);
		try
		{
			mInterface.stop();
		}
		catch (RemoteException e)
		{
			e.printStackTrace();
		}
		finish();
	}

	/**
	 * @role : Update SongList by filtering files from sdCard to end on .mp3
	 */
	public void updateSongList()
	{
		List<File> files = getListFiles(new File(MEDIA_PATH + "/"));
		for (File f : files) {
			if (f.getName().endsWith(".mp3") || f.getName().endsWith(".MP3"))
			{
				Song song = new Song();
				song.setTitle(f.getName());
				song.setPath(f.getPath());
				listOfSong.add(song);
			}
		}
	}

	/**
	 *
	 * @param parentDir
	 * @return all the files in the directory
     */
	public List<File> getListFiles(File parentDir)
	{
		ArrayList<File> allFiles = new ArrayList<File>();
		File[] files = parentDir.listFiles();

		for (File f : files)
		{
			if (f.isDirectory())
			{
				if (f.listFiles() != null)
				{
					allFiles.addAll(getListFiles(f));
				}
			}
			else
			{
				allFiles.add(f);
			}
		}

		return allFiles;
	}

	/**
	 * @role initalise listeners
	 */
	private void registerClickListeners()
	{
		play.setOnClickListener(new OnClickListener() // play song
		{
			public void onClick(View v)
			{
				if (currSong == null)
					try
					{
						mInterface.playSong(listOfSong.get(0).getPath());
					}
					catch (RemoteException e)
					{
						e.printStackTrace();
					}
				else
					try
					{
						mInterface.playSong(currSong.getPath());
					}
					catch (RemoteException e)
					{
						e.printStackTrace();
					}
			}

		});

		pause.setOnClickListener(new OnClickListener() // pause song
		{
			public void onClick(View v)
			{
				try
				{
					mInterface.pauseSong();
				}
				catch (RemoteException e)
				{
					e.printStackTrace();
				}
			}

		});

		back.setOnClickListener(new OnClickListener() // previous song
		{

			public void onClick(View v)
			{
				try {
					mInterface.previousSong();
				}
				catch (RemoteException e)
				{
					e.printStackTrace();
				}
			}

		});

		next.setOnClickListener(new OnClickListener() // next song
		{

			public void onClick(View v)
			{
				try
				{
					mInterface.nextSong();
				}
				catch (RemoteException e)
				{
					e.printStackTrace();
				}
			}

		});
	}

	/**
	 * @role ; showing list of available songs
	 */
	public class MyListAdapter extends ArrayAdapter<Song>
	{
		public MyListAdapter(Context context, int resource, List<Song> objects)
		{
			super(context, resource, objects);
		}

		/**
		 * @param position
		 * @param convertView
		 * @param parent
		 * @return
		 * @role : Called when updating the ListView
		 */

		public View getView(int position, View convertView, ViewGroup parent)
		{
			View row;
			if (convertView == null)
			{
				LayoutInflater inflater = getLayoutInflater();
				row = inflater.inflate(R.layout.music_list_item, parent, false);
			}
			else
			{
				row = convertView;
			}
			TextView title = (TextView) row.findViewById(R.id.music_item_title);
			title.setText(listOfSong.get(position).getTitle());
			return row;
		}
	}

	/**
	 * @role : ServiceConnection to connect Activity with Service
	 */
	private ServiceConnection musicPlayerConnection = new ServiceConnection()
	{
		public void onServiceConnected(ComponentName name, IBinder service)
		{
			mInterface = MusicInterface.Stub.asInterface((IBinder) service);
			updateSongList();
			lv = (ListView) findViewById(android.R.id.list);
			adapter = new MyListAdapter(getApplicationContext(), R.layout.music_list_item, listOfSong);
			lv.setAdapter(adapter);

			lv.setOnItemClickListener(new OnItemClickListener()
			{
				public void onItemClick(AdapterView<?> arg0, View arg1, int arg2, long arg3)
				{
					currSong = listOfSong.get(arg2);
					try
					{
						MusicService.setCurrSong(currSong);
						MusicService.setCurrPos(arg2);
						mInterface.playSong(currSong.getPath());
					}
					catch (RemoteException e)
					{
						e.printStackTrace();
					}
				}

			});

			play = (ImageButton) findViewById(R.id.play_button);
			pause = (ImageButton) findViewById(R.id.pause_button);
			next = (ImageButton) findViewById(R.id.next_button);
			back = (ImageButton) findViewById(R.id.back_button);
			registerClickListeners(); // register clickListeners for Buttons
		}

		@Override
		public void onServiceDisconnected(ComponentName name)
		{}
	};
}
