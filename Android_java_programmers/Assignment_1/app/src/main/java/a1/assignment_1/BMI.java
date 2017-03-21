package a1.assignment_1;

/**
 * BMI.java
 * Created: September 11, 2016
 * Colin FRAPPER
 */
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

public class BMI extends AppCompatActivity
{

        private EditText edit_length;
        private EditText edit_weight;
        private TextView TextAnswer ;
        private Button button_compute ;
        private Button button_reset;

    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.bmi);

        edit_length = (EditText) findViewById(R.id.Edit_length);
        edit_weight = (EditText) findViewById(R.id.Edit_weight);
        TextAnswer = (TextView) findViewById(R.id.Text_answer);
        button_compute = (Button) findViewById(R.id.Button_compute);
        button_reset = (Button) findViewById(R.id.Button_reset);

        button_compute.setOnClickListener(ClickListenerCompute);
        button_reset.setOnClickListener(ClickListenerReset);
    }

    private View.OnClickListener ClickListenerCompute = new View.OnClickListener()
    {
        public void onClick(View v)
        {
            String string1 = edit_length.getText().toString();
            String string2 = edit_weight.getText().toString();

            if(TextUtils.isEmpty(string1) || !TextUtils.isDigitsOnly(string1))
            {
                edit_length.setError("Please enter your length and don't use characters");
                return;
            }
            if(TextUtils.isEmpty(string2) || !TextUtils.isDigitsOnly(string2))
            {
                edit_weight.setError("Please enter your weight and don't use characters");
                return;
            }

            float length = Float.parseFloat(string1)/100;
            float weight = Float.parseFloat(string2);
            float bmiValue = calculateBMI(weight, length);
            String bmiInterpretation = interpretBMI(bmiValue);
            TextAnswer.setText(String.valueOf(bmiValue + "-" + bmiInterpretation));
        }
    };

    private float calculateBMI (float weight, float length)
    {
        return (float) (weight / (length * length));
    }

    private String interpretBMI(float bmiValue)
    {
        if (bmiValue < 16)
        {
            return "Severely underweight";
        }
        else if (bmiValue < 18.5)
        {
            return "Underweight";
        }
        else if (bmiValue < 25)
        {
            return "Normal";
        }
        else if (bmiValue < 30)
        {
            return "Overweight";
        }
        else
        {
            return "Obese";
        }
    }

    private View.OnClickListener ClickListenerReset = new View.OnClickListener()
    {
        public void onClick(View v)
        {
            edit_length.getText().clear();
            edit_weight.getText().clear();
            TextAnswer.setText("");
        }
    };
}
