package a1.assignment_1;

/**
 * Add_country.java
 * Created: September 11, 2016
 * Colin FRAPPER
 */
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

public class Add_country extends AppCompatActivity
{

    private EditText AnswerCountry;
    private EditText AnswerYear;
    private Button Button_send;

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.add_country);

        AnswerCountry = (EditText) findViewById(R.id.Edit_country);
        AnswerYear = (EditText) findViewById(R.id.Edit_year);
        Button_send = (Button) findViewById(R.id.Button_send_data_country);

        Button_send.setOnClickListener(ClickListenerCompute);
    }
    private View.OnClickListener ClickListenerCompute = new View.OnClickListener()
    {
        public void onClick(View v)
        {
            String Country = AnswerCountry.getText().toString();
            String Year = AnswerYear.getText().toString();

            if (TextUtils.isEmpty(Country) || TextUtils.isDigitsOnly(Country))
            {
                AnswerCountry.setError("Please enter the country and don't use number");
                return;
            }
            if (TextUtils.isEmpty(Year) || !TextUtils.isDigitsOnly(Year))
            {
                AnswerYear.setError("Please enter the year and don't use characters");
                return;
            }

            Intent result = new Intent();
            result.putExtra("country", Country);
            result.putExtra("year", Year);
            setResult(RESULT_OK, result);
            finish();
        }
    };
}

