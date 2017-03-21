package androidproject.my_project;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

public class ResultActivity extends AppCompatActivity {


    private int scoreFinal ;
    private int level_game ;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.result);

        TextView score = (TextView) findViewById(R.id.score);
        TextView highScore = (TextView) findViewById(R.id.highScore);
        TextView level = (TextView) findViewById(R.id.level);

        level_game = getIntent().getIntExtra("level",0);
        level.setText("Your level  : " + level_game +"");
        scoreFinal = getIntent().getIntExtra("score",0);
        score.setText(scoreFinal + "");

        SharedPreferences settings = getSharedPreferences("game_data", Context.MODE_PRIVATE);
        int highScoreFinal = settings.getInt("high_score", 0);

        if(scoreFinal > highScoreFinal)
        {
            highScore.setText("New high score : " + scoreFinal);

            // Save
            SharedPreferences.Editor editor = settings.edit();
            editor.putInt("high_score", scoreFinal);
            editor.commit();
        }
        else
        {
            highScore.setText("High Score : " + highScoreFinal);
        }
    }

    public void tryAgain(View v)
    {
        Intent intent = new Intent(getApplicationContext(),startActivity.class);
        startActivity(intent);
    }

    public void shareResult(View v)
    {
        String text = "My score  : " + String.valueOf(scoreFinal) ;
        Intent share = new Intent(Intent.ACTION_SEND);
        share.setType("text/plain");
        share.putExtra(Intent.EXTRA_TEXT, text);
        try {
            startActivity(Intent.createChooser(share, getResources().getString(R.string.send_via)));
        } catch (android.content.ActivityNotFoundException ex) {
            Toast.makeText(ResultActivity.this, getResources().getString(R.string.no_messaging_app), Toast.LENGTH_SHORT).show();
        }
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
}
