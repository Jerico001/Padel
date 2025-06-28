
'use client';
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function MexicanoApp() {
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("");
  const [round, setRound] = useState(1);
  const [matches, setMatches] = useState([]);
  const [leaderboard, setLeaderboard] = useState({});

  const addPlayer = () => {
    if (name.trim()) {
      const newPlayer = { id: crypto.randomUUID(), name, points: 0 };
      setPlayers([...players, newPlayer]);
      setLeaderboard({ ...leaderboard, [newPlayer.id]: 0 });
      setName("");
    }
  };

  const generateMatches = () => {
    const sortedPlayers = [...players].sort(
      (a, b) => (leaderboard[a.id] || 0) - (leaderboard[b.id] || 0)
    );
    const newMatches = [];
    for (let i = 0; i < sortedPlayers.length; i += 4) {
      if (i + 3 < sortedPlayers.length) {
        newMatches.push({
          team1: [sortedPlayers[i], sortedPlayers[i + 3]],
          team2: [sortedPlayers[i + 1], sortedPlayers[i + 2]],
          score1: "",
          score2: ""
        });
      }
    }
    setMatches(newMatches);
  };

  const submitScores = () => {
    const updatedLeaderboard = { ...leaderboard };
    matches.forEach(match => {
      const s1 = parseInt(match.score1);
      const s2 = parseInt(match.score2);
      if (!isNaN(s1) && !isNaN(s2)) {
        match.team1.forEach(p => (updatedLeaderboard[p.id] += s1));
        match.team2.forEach(p => (updatedLeaderboard[p.id] += s2));
      }
    });
    setLeaderboard(updatedLeaderboard);
    setRound(round + 1);
    setMatches([]);
  };

  return (
    <div className="p-4 space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-bold">Add Players</h2>
          <div className="flex gap-2">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name" />
            <Button onClick={addPlayer}>Add</Button>
          </div>
          <ul className="list-disc ml-5">
            {players.map((p) => (
              <li key={p.id}>{p.name}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-bold">Round {round}</h2>
          <Button onClick={generateMatches}>Generate Matches</Button>
          {matches.map((match, idx) => (
            <div key={idx} className="space-y-2 border-t pt-2">
              <div>Team 1: {match.team1.map(p => p.name).join(" & ")}</div>
              <div>Team 2: {match.team2.map(p => p.name).join(" & ")}</div>
              <div className="flex gap-2">
                <Input type="number" placeholder="Team 1 score" value={match.score1} onChange={(e) => {
                  const m = [...matches];
                  m[idx].score1 = e.target.value;
                  setMatches(m);
                }} />
                <Input type="number" placeholder="Team 2 score" value={match.score2} onChange={(e) => {
                  const m = [...matches];
                  m[idx].score2 = e.target.value;
                  setMatches(m);
                }} />
              </div>
            </div>
          ))}
          {matches.length > 0 && <Button onClick={submitScores}>Submit Scores</Button>}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-bold">Leaderboard</h2>
          <ul className="list-decimal ml-5">
            {players
              .sort((a, b) => (leaderboard[b.id] || 0) - (leaderboard[a.id] || 0))
              .map((p) => (
                <li key={p.id}>{p.name}: {leaderboard[p.id] || 0} pts</li>
              ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
