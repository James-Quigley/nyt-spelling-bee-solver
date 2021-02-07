package main

import (
	"io/ioutil"
	"log"
	"strings"
)

func strContains(s string, c rune) bool {
	for _, r := range s {
		if r == c {
			return true
		}
	}
	return false
}

func sliceContains(s []rune, r rune) bool {
	for _, c := range s {
		if c == r {
			return true
		}
	}
	return false
}

func isValid(letters []rune, word string) {
	if len(word) < 4 {
		return
	}
	if !strContains(word, letters[0]) {
		return
	}
	for _, r := range word {
		if !sliceContains(letters, r) {
			return
		}
	}
	log.Println(word)
}

func main() {
	characters := []rune{'e', 'p', 'o', 'n', 'c', 'y', 't'}
	data, err := ioutil.ReadFile("./words.txt")
	if err != nil {
		log.Fatalln(err)
	}
	lines := strings.Split(string(data), "\n")
	for _, line := range lines {
		go isValid(characters, line)
	}
}
