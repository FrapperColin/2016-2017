// MusicInterface.aidl
package a2.assignment2.MediaPlayer;

// Declare any non-default types here with import statements

interface MusicInterface {
    void playSong(String song);
    	void pauseSong();
    	void previousSong();
    	void nextSong();
    	void stop();
}
