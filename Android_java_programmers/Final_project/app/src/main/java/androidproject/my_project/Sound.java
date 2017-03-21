package androidproject.my_project;

import android.content.Context;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.media.SoundPool;
import android.os.AsyncTask;

/**
 * Created by moi on 18/10/2016.
 */
public class Sound
{

    private static SoundPool soundPool ;
    private static int hitSound ;
    private static int overSound ;

    public Sound(Context context)
    {
        // SoundPool (int maxStreams, int streamType, int srcQuality)
        soundPool = new SoundPool(2, AudioManager.STREAM_MUSIC, 0);

        hitSound = soundPool.load(context, R.raw.hit,1);
        overSound = soundPool.load(context, R.raw.over, 1);
    }

    public void playHitSound()
    {
        // int play (int soundID, float leftVolume, float rightVolume, int priority, int loop, float rate)
        soundPool.play(hitSound, 1.0F, 1.0F, 1, 0, 1.0F);
    }

    public void playOverSound()
    {
        soundPool.play(overSound, 1.0F, 1.0F, 1, 0, 1.0F);
    }


    public void pause()
    {
        soundPool.autoPause();
    }



}
