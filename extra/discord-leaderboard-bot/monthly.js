const medals = [":first_place:", ":second_place:", ":third_place:"]

const postDailyLeaderboard = async () => {
  console.log("fetching leaderboards...")
  const [monthlyResponse, lastUpdatedResponse] = await Promise.all([
    fetch(`${process.env.LEADERBOARD_API_URL}/api/leaderboard/monthly`),
    fetch(`${process.env.LEADERBOARD_API_URL}/api/leaderboard/last-update`)
  ])
  if (!monthlyResponse.ok) {
    console.error(response)
    throw new Error("Can't fetch leaderboard", response)
  }

  const monthlyResults = await monthlyResponse.json()
  const lastUpdated = await lastUpdatedResponse.json()

  const top10Text = monthlyResults
    .slice(0, 5)
    .map(
      (leader, index) =>
        `${medals[index] || ":medal:"}  **[${leader.name}](<${leader.htmlUrl})**
         ┗  <:gitcommit:1431326557330210868> commits:  \`${leader.commits}\`  <:gitcompare:1431327273281130618> change score: \`${leader.changeScore.toFixed(2)}\`  <:circlestar:1431328059797012673> overall: \`${leader.overallScore.toFixed(2)}\``,
    )
    .join("\n")

  console.log("posting discord webhook...")
  // create the webhook
  const webhookResponse = await fetch(process.env.DISCORD_WEBHOOK_MONTHLY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: `##      :trophy:     Sliitmozilla Monthly Github Leaderboard     :trophy: 

${top10Text}

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
