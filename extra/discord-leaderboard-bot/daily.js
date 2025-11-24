const medals = [":first_place:", ":second_place:", ":third_place:", ":medal:", ":medal:"]

const postDailyLeaderboard = async () => {
  console.log("fetching leaderboards...")
  const [allTimeResponse, dailyResponse, lastUpdatedResponse] = await Promise.all([
    fetch(`${process.env.LEADERBOARD_API_URL}/api/leaderboard`),
    fetch(`${process.env.LEADERBOARD_API_URL}/api/leaderboard/daily`),
    fetch(`${process.env.LEADERBOARD_API_URL}/api/leaderboard/last-update`)
  ])
  if (!allTimeResponse.ok || !dailyResponse.ok) {
    console.error(response)
    throw new Error("Can't fetch leaderboard", response)
  }

  const allTimeResults = await allTimeResponse.json()
  const dailyResults = await dailyResponse.json()
  const lastUpdated = await lastUpdatedResponse.json()

  const topFiveText = allTimeResults
    .slice(0, 5)
    .map(
      (leader, index) =>
        `${medals[index]}  **[${leader.name}](<${leader.htmlUrl})**
         ┗  <:gitcommit:1431326557330210868> commits:  \`${leader.commits}\`  <:gitcompare:1431327273281130618> change score: \`${leader.changeScore.toFixed(2)}\`  <:circlestar:1431328059797012673> overall: \`${leader.overallScore.toFixed(2)}\``,
    )
    .join("\n")

  const dailyText = dailyResults
    .slice(0, 5)
    .map(
      (leader, index) =>
        `${medals[index]} **[${leader.name}](<${leader.htmlUrl})** ( \`${leader.commits}\`/\`${leader.changeScore.toFixed(2)}\`/\`${leader.overallScore.toFixed(2)}\` )`,
    )
    .join("**   |   **")

  console.log("posting discord webhook...")
  // create the webhook
  const webhookResponse = await fetch(process.env.DISCORD_WEBHOOK_DAILY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: `##      :trophy:     Sliitmozilla Github Leaderboard     :trophy: 

### All time
${topFiveText}
### Today
> ${dailyResults.length > 0 ? dailyText : "None yet"}

Last updated: <t:${Math.round(lastUpdated / 1000)}:R>**  |  **[View all](<https://leaderboard.sliitmozilla.org/)`,
    }),
  })

  if (!webhookResponse.ok) {
    console.error(webhookResponse)
    console.error(await webhookResponse.json())
    throw new Error("Can't post discord webhook", webhookResponse)
  }
  console.log("done.")
}

await postDailyLeaderboard()
