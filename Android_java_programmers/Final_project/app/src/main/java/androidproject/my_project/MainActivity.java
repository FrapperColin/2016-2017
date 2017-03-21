package androidproject.my_project;

import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Point;
import android.media.MediaPlayer;
import android.os.Handler;
import android.preference.PreferenceManager;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.Display;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.Timer;
import java.util.TimerTask;

public class MainActivity extends AppCompatActivity
{

    private TextView Textscore ;
    private TextView start ;
    private ImageView box ;
    private ImageView box_orange ;
    private ImageView box_black ;
    private ImageView box_pink ;


    // Preference background
    private SharedPreferences sp;

    // Setting activity
    SettingActivity setting ;

    // Size of the screen
    private int frameHeight ;
    private int boxSize ;
    private int screenWidth ;
    private int screenWeight ;

    // Position of the box
    private int boxY ;
    private int box_orangeX ;
    private int box_orangeY ;
    private int box_pinkX ;
    private int box_pinkY ;
    private int box_blackX ;
    private int box_blackY ;


    // Score
    private int score = 0 ;

    // Initialize class

    // https://developer.android.com/reference/android/os/Handler.html
    private Handler handler = new Handler();

    // https://developer.android.com/reference/java/util/Timer.html
    private Timer timer = new Timer();



    // https://developer.android.com/reference/android/media/SoundPool.html
    private Sound sound ;


    public static MediaPlayer player ;


    ArrayList<Integer> myTabColor = new ArrayList<>();




    // Status Check
    private boolean action_flg = false ;
    private boolean start_flg = false ;
    private boolean paused = false ;
    private boolean changes = false ;

    private int i  ;
    private int eat_ball = 0 ;
    private int level = 0 ;


    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);

        // getting preferences
        PreferenceManager.setDefaultValues(this, R.xml.prefs, false);
        sp = PreferenceManager.getDefaultSharedPreferences(this);

        View view = findViewById(R.id.view);
        loadBackgroundPreferences(view);

        sound = new Sound(this);

        //loadMusicPreferences();

        myTabColor.add(R.color.blue);
        myTabColor.add(R.color.light_green);
        myTabColor.add(R.color.light_blue);
        myTabColor.add(R.color.white);


        Textscore = (TextView) findViewById(R.id.score);
        start = (TextView) findViewById(R.id.start);
        box = (ImageView) findViewById(R.id.box);
        box_orange = (ImageView) findViewById(R.id.box_orange);
        box_black = (ImageView) findViewById(R.id.box_black);
        box_pink = (ImageView) findViewById(R.id.box_pink);



        // Get screen size

        WindowManager wm = getWindowManager();
        Display display = wm.getDefaultDisplay();
        Point size = new Point();
        display.getSize(size);

        screenWidth = size.x;
        screenWeight = size.y ;



        // Move to out of screen at the start
        box_orange.setX(-80);
        box_orange.setY(-80);
        box_pink.setX(-80);
        box_pink.setY(-80);
        box_black.setX(-80);
        box_black.setY(-80);

        Textscore.setText("@string/score_start" );

        i = 0 ;


    }

    public void loadMusicPreferences()
    {
        if (setting.sound_off)
        {
            player = MediaPlayer.create(MainActivity.this, R.raw.tetris);

            player.setLooping(true);
            player.setVolume(0,0);
            player.start();
        }
        else
        {
            player = MediaPlayer.create(MainActivity.this, R.raw.tetris);
            player.setLooping(true);
            player.setVolume(50,50);
            player.start();
        }
    }

    public void changePosition()
    {
        hitCheck();

        upgradeLevel();

        // Orange box
        box_orangeX -= 12 + 4*level;
        if(box_orangeX < 0 )
        {
            box_orangeX = screenWidth +20 ;
            box_orangeY = (int) Math.floor(Math.random()*(frameHeight - box_orange.getHeight()));
        }
        box_orange.setX(box_orangeX);
        box_orange.setY(box_orangeY);


        // Black box
        box_blackX -= 16 + 4*level;
        if(box_blackX < 0 )
        {
            box_blackX = screenWidth + 10 ;
            box_blackY = (int) Math.floor(Math.random()*(frameHeight - box_black.getHeight()));
        }
        box_black.setX(box_blackX);
        box_black.setY(box_blackY);

        // Pink box
        box_pinkX -= 20 + 4*level;
        if(box_pinkX < 0 )
        {
            box_pinkX = screenWidth + 5000 ;
            box_pinkY = (int) Math.floor(Math.random()*(frameHeight - box_pink.getHeight()));
        }
        box_pink.setX(box_pinkX);
        box_pink.setY(box_pinkY);

        // Move box
        if(action_flg)
        {
            // Touching
            boxY -= 20 ;
        }
        else
        {
            boxY += 20 ;
        }

        // Check box position
        if(boxY < 0)
        {
            boxY = 0 ;
        }

        if(boxY > frameHeight - boxSize)
        {
            boxY = frameHeight - boxSize ;
        }
        box.setY(boxY);

        Textscore.setText("Score : " + score);


    }

    public void upgradeLevel()
    {

        if(eat_ball != 0 && eat_ball % 5 == 0 && !changes)
        {
            changes = true ;

            View view = findViewById(R.id.view);
            view.setBackgroundResource(myTabColor.get(i));
            if (i == myTabColor.size()-1)
            {
                i = 0 ;
            }
            else
            {
                i++ ;
            }
            level ++ ;
            Toast toast = Toast.makeText(this, "Level up !", Toast.LENGTH_LONG);
            toast.show();
        }
        else if (eat_ball % 5 != 0)
        {
            changes = false ;
        }

    }


    public void hitCheck()
    {
        // If the center of the ball is in the box, it counts as a hit

        // Orange box
        int orangeCenterX = box_orangeX + box_orange.getWidth() /2 ;
        int orangeCenterY = box_orangeY + box_orange.getHeight() /2 ;

        if (0 <= orangeCenterX && orangeCenterX <= boxSize && boxY <= orangeCenterY && orangeCenterY <= boxY + boxSize)
        {
            score += 10 ;
            eat_ball += 1 ;
            box_orangeX = -10 ;
            if (!setting.sound_off)
            {
                sound.playHitSound();
            }
        }

        // Pink box

        int pinkCenterX = box_pinkX + box_pink.getWidth() /2 ;
        int pinkCenterY = box_pinkY + box_pink.getHeight() /2 ;

        if (0 <= pinkCenterX && pinkCenterX <= boxSize && boxY <= pinkCenterY && pinkCenterY <= boxY + boxSize)
        {
            score += 30 ;
            eat_ball += 1 ;
            box_pinkX = -5 ;
            if (!setting.sound_off)
            {
                sound.playHitSound();
            }

        }


        // Black box
        int blackCenterX = box_blackX + box_black.getWidth() /2 ;
        int blackCenterY = box_blackY + box_black.getHeight() /2 ;

        if (0 <= blackCenterX && blackCenterX <= boxSize && boxY <= blackCenterY
                && blackCenterY <= boxY + boxSize)
        {
            if (!setting.sound_off)
            {
                sound.playOverSound();
            }

            // Show the result

            Intent intent = new Intent(getApplicationContext(), ResultActivity.class);
            intent.putExtra("score", score);
            intent.putExtra("level",level);
            startActivity(intent);
        }

    }

    private void loadBackgroundPreferences(View view)
    {
        sp = PreferenceManager.getDefaultSharedPreferences(this);
        String backgroundColor = sp.getString(getResources().getString(R.string.prefs_back_color_key), "0");
        int colorBack = Integer.parseInt(backgroundColor);

        if (colorBack == 0)
        {
            view.setBackgroundResource(R.color.white);
        }
        else if (colorBack == 1)
        {
            view.setBackgroundResource(R.color.blue);
        }
        else if (colorBack == 2)
        {
            view.setBackgroundResource(R.color.black);
        }
        else if (colorBack == 3)
        {
            view.setBackgroundResource(R.color.green);
        }
        else if (colorBack == 4)
        {
            view.setBackgroundResource(R.color.red);
        }
        else if (colorBack == 5)
        {
            view.setBackgroundResource(R.color.yellow);
        }
    }

    // https://developer.android.com/reference/android/view/MotionEvent.html
    public boolean onTouchEvent(MotionEvent e)
    {
        if (!start_flg)
        {
            start_flg = true ;


            FrameLayout frame = (FrameLayout) findViewById(R.id.frame);
            frameHeight = frame.getHeight();

            boxY = (int) box.getY();


            boxSize = box.getHeight();

            start.setVisibility(View.GONE);

            reScheduleTimer();


        }
        else
        {
            // getAction : Return the kind of action being performed
            if(e.getAction()== MotionEvent.ACTION_DOWN )
            {
                action_flg = true ;
            }
            else if(e.getAction() == MotionEvent.ACTION_UP )
            {
                action_flg = false ;
            }
        }

        return true ;
    }

    // Disable return action
    public boolean dispatchKeyEvent(KeyEvent e)
    {
        if(e.getAction() == KeyEvent.ACTION_DOWN)
        {
            switch(e.getKeyCode())
            {
                case KeyEvent.KEYCODE_BACK:
                    return true ;
            }
        }
        return super.dispatchKeyEvent(e);
    }

    private class MyTimerTask extends TimerTask
    {
        @Override
        public void run()
        {
            handler.post(new Runnable()
            {
                @Override
                public void run() {
                    changePosition();
                }
            });
        }
    }

    public void reScheduleTimer()
    {
        timer = null ;
        timer = new Timer();
        TimerTask timerTask = new MyTimerTask();
        timer.schedule(timerTask, 0,20);
    }

    public void backHome(View v)
    {
        Intent intent = new Intent(getApplicationContext(), startActivity.class);
        startActivity(intent);
    }

    public void onResume()
    {
        super.onResume();
        loadMusicPreferences();
        start_flg = false;
        if(paused)
        {
            start.setText("Tap to continue !");
            paused = false ;
        }
        start.setVisibility(View.VISIBLE);

    }



    public void onPause()
    {
        super.onPause();
        player.pause();

        if(timer!=null)
        {
            timer.cancel();
        }
        timer = null ;


        paused = true ;
    }

}
