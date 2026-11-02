import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { cards } from '@/site/content'

function Home() {
  return (
    <section>
      <title>Home</title>
      <div className="flex flex-col items-center justify-center w-full h-full p-3">
        <h1 className="p-6">Main Page</h1>
        <p>
          This is my own little website/tinkering space. I'm gonna continue updating this as I go
          (might be a good idea to look at this as kinda my own little blog I suppose).
        </p>
        <article className="flex flex-col gap-3">
          {cards.map((card, i) => (
            <Card key={i} className="w-full shrink-0 h-fit">
              <CardHeader>
                <CardTitle>{card.title}</CardTitle>
              </CardHeader>
              <CardContent>{card.content}</CardContent>
              {card.footer && (
                <CardFooter>
                  {!card.link && card.footer}
                  {card.link && (
                    <>
                      <p>{card.footer}</p>
                      <a href={card.link}>{card.link}</a>
                    </>
                  )}
                </CardFooter>
              )}
            </Card>
          ))}
        </article>
      </div>
    </section>
  )
}

export default Home
