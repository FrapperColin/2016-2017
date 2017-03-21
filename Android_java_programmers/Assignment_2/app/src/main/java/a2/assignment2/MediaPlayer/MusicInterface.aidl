// MusicInterface.aidl
package a2.assignment2.MediaPlayer;

/**
 * @author Colin FRAPPER
 * @date 24/09/2016
 * Interface Music
 */

interface MusicInterface
{
    void playSong(String song);
    void pauseSong();
    void previousSong();
    void nextSong();
    void stop();
}
