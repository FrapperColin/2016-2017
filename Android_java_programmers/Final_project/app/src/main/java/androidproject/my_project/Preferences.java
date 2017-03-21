package androidproject.my_project;

import android.preference.PreferenceActivity;

import java.util.List;

/**
 * Load Preference Header
 *
 */
public class Preferences extends PreferenceActivity { // implements OnSharedPreferenceChangeListener

	@Override
	public void onBuildHeaders(List<Header> target) {
		loadHeadersFromResource(R.xml.preference_headers, target);
	}

	protected boolean isValidFragment(String fragmentName)
	{
		return MyPreferenceFragment.class.getName().equals(fragmentName);
	}
}