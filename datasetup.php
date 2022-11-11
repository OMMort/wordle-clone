<?php

#get data file
$word_list = './wordlist.txt';
$file_handle = fopen($word_list, 'r');
 
function get_all_lines($file_handle) { 
    while (!feof($file_handle)) {
        yield fgets($file_handle);
    }
}
 
$count = 0;
 
foreach (get_all_lines($file_handle) as $line) {
    $wordlen = strlen($line);
    if( !isset( $wordlist[$wordlen]['count'] ) ):
        $wordlist[$wordlen]['count'] = 1;
    else:
        $wordlist[$wordlen]['count']++;
    endif;

    $wordlist[$wordlen]['data'][] = $line;
}

fclose($file_handle);

ksort($wordlist);
$wordlistdata = array_keys($wordlist);
foreach( $wordlistdata as $chars ):
    echo '<br />'.$chars.' Character Words : '.$wordlist[$chars]['count'];
endforeach;