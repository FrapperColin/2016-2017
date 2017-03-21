package a2.assignment2.MediaPlayer;

import a2.assignment2.R;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import android.app.Notification;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.media.MediaPlayer;
import android.media.MediaPlayer.OnCompletionListener;
import android.os.Binder;
import android.os.Environment;
import android.os.IBinder;
import android.os.RemoteException;
import android.support.v4.app.NotificationCompat;


/**
 * @author Colin FRAPPER
 * @date 24/09/2016
 */

public class MusicService extends Service
{
	private static final String MEDIA_PATH = Environment.getExternalStorageDirectory().getPath();
	private List<Song> listOfSong;
	private static int currPos;
	private MediaPlayer player = new MediaPlayer();
	private static Song currSong;
	private int pos;

	/**
	 * @param intent
	 * @param flags
	 * @param startId
     */
	public int onStartCommand(Intent intent, int flags, int startId)
	{
		listOfSong = getAudioFiles();
		return super.onStartCommand(intent, flags, startId);
	}

	/**
	 *
	 * @param intent
     */
	public IBinder onBind(Intent intent) {
		return musicBinder;
	}

	/**
	 * @role : Implementing method from MusicInterface
	 */
	private final MusicInterface.Stub musicBinder = new MusicInterface.Stub()
	{
		/**
		 * @param song
		 * @throws RemoteException
         */
		public void playSong(String song) throws RemoteException
		{
			if (listOfSong == null)
			{
				listOfSong = getAudioFiles();
			}
			if (getCurrentSong() == null)
			{
				setCurrSong(listOfSong.get(currPos));
			}
			buildNotification();

			player.reset();
			try
			{
				player.setDataSource(getCurrentSong().getPath());
				player.prepare();
				if (pos != 0)
				{
					player.seekTo(pos);
					pos = 0;
				}
			}
			catch (IOException e)
			{
				e.printStackTrace();
			}
			player.start();

			player.setOnCompletionListener(new OnCompletionListener()
			{
				public void onCompletion(MediaPlayer mp)
				{
					try
					{
						nextSong();
					}
					catch (RemoteException e)
					{
						e.printStackTrace();
					}
				}
			});
		}

		/**
		 *
		 * @throws RemoteException
         */
		public void pauseSong() throws RemoteException
		{
			if (listOfSong == null)
			{
				listOfSong = getAudioFiles();
			}
			setCurrSong(listOfSong.get(currPos));
			pos = player.getCurrentPosition();
			player.pause();
		}

		/**
		 *
		 * @throws RemoteException
         */
		public void previousSong() throws RemoteException
		{
			if (listOfSong == null)
			{
				listOfSong = getAudioFiles();
			}
			if (--currPos < 0)  // if it's the first song
			{
				currPos = listOfSong.size() - 1; // last song
			}
			setCurrSong(listOfSong.get(currPos));
			pos = 0;
			playSong(getCurrentSong().getPath());
		}

		/**
		 * @throws RemoteException
         */
		public void nextSong() throws RemoteException
		{
			if (listOfSong == null)
			{
				listOfSong = getAudioFiles();
			}
			if (++currPos  >= listOfSong.size())
			{
				currPos = 0;
			}
			setCurrSong(listOfSong.get(currPos));
			setCurrPos(currPos);
			pos = 0;
			playSong(getCurrentSong().getPath());
		}

		/**
		 *
		 * @throws RemoteException
         */
		public void stop() throws RemoteException
		{
			stopService();
		}
	};

	/**
	 *
	 * @return List of song
     */
	public List<Song> getAudioFiles()
	{
		ArrayList<Song> s = new ArrayList<Song>();
		List<File> files = getListFiles(new File(MEDIA_PATH + "/"));

		for (File f : files)
		{
			if (f.getName().endsWith(".mp3") || f.getName().endsWith(".MP3"))
			{
				Song song = new Song();
				song.setTitle(f.getName());
				song.setPath(f.getPath());
				s.add(song);
			}
		}
		return s;
	}

	protected void stopService()
	{
		this.stopSelf();

	}


    public void onDestroy()
	{
		stopForeground(true);
		if (player != null)
		{
			player.stop();
			player.release();
		}
		super.onDestroy();
	}

	protected static void setCurrPos(int pos)
	{
		currPos = pos;
	}

	protected void buildNotification()
	{
		NotificationCompat.Builder notBuild = new NotificationCompat.Builder(this);
		notBuild.setContentTitle("You are listening : ");
		notBuild.setContentText(getCurrentSong().getTitle());
		notBuild.setSmallIcon(android.R.drawable.ic_media_play);
		notBuild.setOngoing(true);
		Intent intent = new Intent(getApplicationContext(), MP3Player.class);
		intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
		intent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
		PendingIntent pendInt = PendingIntent.getActivity(this, 0, intent, 0);
		notBuild.setContentIntent(pendInt);
		Notification not = notBuild.build();
		startForeground(1, not);
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
	 * @role : getter
	 * @return the current song
	 */
	public Song getCurrentSong()
	{
		return currSong;
	}

	/**
	 * @role : setter
	 * the currSong to set
	 */
	public static void setCurrSong(Song s)
	{
		currSong = s;
	}


}
