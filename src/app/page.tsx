"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {getStock} from "@/services/stock";
import {toast} from "@/hooks/use-toast";
import {Icons} from "@/components/icons";
import {summarizeNewsArticle} from "@/ai/flows/summarize-news-article";
import {suggestNewsTopics} from "@/ai/flows/suggest-news-topics";

const SAMPLE_ARTICLE_URL = 'https://www.nytimes.com/2024/07/04/us/politics/trump-supreme-court-abortion.html';
const SAMPLE_ARTICLE_CONTENT = `Former President Donald J. Trump has said he would nominate justices who would overturn Roe v. Wade.

By Maggie Haberman
Former President Donald J. Trump often boasted that he was responsible for the Supreme Court’s 2022 decision overturning Roe v. Wade, the landmark ruling that had established a constitutional right to an abortion. On Thursday, the second anniversary of the court’s decision, he took credit for it.

“I was able to terminate Roe v. Wade,” Mr. Trump told a group of Christian conservatives at a conference in Washington. “I did something that nobody thought was possible.”

Mr. Trump made similar remarks to donors at a fund-raiser on Wednesday, according to a person familiar with his comments.

Mr. Trump’s remarks came as President Biden’s campaign has increasingly emphasized the issue of abortion rights, seeking to make it a central part of his contest against Mr. Trump.

Mr. Trump’s remarks also came as his position on abortion has become increasingly muddled, as he has tried to avoid alienating moderate voters who may be supportive of abortion rights. He has previously said that he would leave the issue up to the states, but he has also suggested that he would support a national ban on abortion after a certain point in pregnancy.

At the conference on Thursday, Mr. Trump also repeated his false claims about the 2020 election, and he took aim at the House speaker, Mike Johnson, calling him “a man that I thought was very good” but criticizing him for not doing enough to overturn the results of the election.

Mr. Trump’s remarks came as he is facing mounting legal pressure on multiple fronts, including a criminal investigation into his efforts to overturn the 2020 election in Georgia.`;
const SAMPLE_USER_PROFILE = 'A busy professional in their late 30s, interested in technology, finance, and current events.';
const SAMPLE_READING_HISTORY = 'Recent articles about AI, stock market trends, and political developments.';

export default function Home() {
  const [stockPrice, setStockPrice] = useState<number | null>(null);
  const [articleSummary, setArticleSummary] = useState<string | null>(null);
  const [suggestedTopics, setSuggestedTopics] = useState<string[] | null>(null);

  const fetchStockPrice = async () => {
    try {
      const stock = await getStock("MSFT");
      setStockPrice(stock.price);
      toast({
        title: "Stock Price Updated",
        description: `The current price of MSFT is ${stock.price}`,
      });
    } catch (error: any) {
      toast({
        title: "Error fetching stock price",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const summarizeArticle = async () => {
    try {
      const summary = await summarizeNewsArticle({
        articleUrl: SAMPLE_ARTICLE_URL,
        articleContent: SAMPLE_ARTICLE_CONTENT,
      });
      setArticleSummary(summary.summary);
      toast({
        title: "Article Summarized",
        description: "The article has been successfully summarized.",
      });
    } catch (error: any) {
      toast({
        title: "Error summarizing article",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const suggestTopics = async () => {
    try {
      const topics = await suggestNewsTopics({
        userProfile: SAMPLE_USER_PROFILE,
        readingHistory: SAMPLE_READING_HISTORY,
      });
      setSuggestedTopics(topics.suggestedTopics);
      toast({
        title: "Topics Suggested",
        description: "News topics have been successfully generated.",
      });
    } catch (error: any) {
      toast({
        title: "Error generating topics",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    // Fetch stock price on component mount
    fetchStockPrice();
    summarizeArticle();
    suggestTopics();
  }, []);

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <SidebarTrigger className="md:hidden"/>
            <h1 className="font-bold">LifeHub</h1>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Tasks</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Icons.home/>
                    <span>All Tasks</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Icons.plusCircle/>
                    <span>Create Task</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
            <SidebarSeparator/>
            <SidebarGroup>
              <SidebarGroupLabel>News</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Icons.messageSquare/>
                    <span>News Feed</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Icons.settings/>
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <Button variant="outline">Settings</Button>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <div className="p-4">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Task Management</CardTitle>
                </CardHeader>
                <CardContent>
                  Manage your tasks effectively to stay productive.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>News Feed</CardTitle>
                </CardHeader>
                <CardContent>
                  Stay updated with the latest news based on your interests.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Stock Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  {stockPrice !== null ? (
                    `MSFT: $${stockPrice}`
                  ) : (
                    "Loading stock price..."
                  )}
                </CardContent>
                <CardContent>
                  <Button onClick={fetchStockPrice}>
                    Update Stock Price
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>AI News Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  {articleSummary !== null ? (
                    `${articleSummary}`
                  ) : (
                    "Loading summary..."
                  )}
                </CardContent>
                <CardContent>
                  <Button onClick={summarizeArticle}>
                    Update News Summary
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>AI Suggested News Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  {suggestedTopics !== null ? (
                    `${suggestedTopics.join(', ')}`
                  ) : (
                    "Loading suggestions..."
                  )}
                </CardContent>
                <CardContent>
                  <Button onClick={suggestTopics}>
                    Suggest News Topics
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
