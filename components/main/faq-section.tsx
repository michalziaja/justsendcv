import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  
  export function FaqSection() {
    const faqs = [
      {
        question: "Jak działa rozszerzenie Chrome do zapisywania ofert?",
        answer:
          "Nasze rozszerzenie Chrome automatycznie wykrywa oferty pracy na popularnych portalach (Pracuj.pl, NoFluffJobs, JustJoinIT i inne). Wystarczy jedno kliknięcie, aby zapisać ofertę w JustSend.cv. System automatycznie wyodrębnia kluczowe informacje, takie jak wymagania, zakres obowiązków czy oferowane benefity.",
      },
      {
        question: "Jakie portale z ofertami pracy są wspierane?",
        answer:
          "Aktualnie wspieramy największe portale w Polsce: Pracuj.pl, NoFluffJobs, JustJoinIT, BulldogJob, theprotocol.it. Lista jest stale rozszerzana. Jeśli brakuje Twojego ulubionego portalu, daj nam znać - regularnie dodajemy nowe integracje.",
      },
      {
        question: "Jak działa system śledzenia statusów aplikacji?",
        answer:
          "Po zapisaniu oferty, możesz śledzić jej status w dedykowanym panelu. Dostępne statusy to m.in.: 'Zapisana', 'CV Wysłane', 'W trakcie rekrutacji', 'Rozmowa techniczna', 'Oferta'. System automatycznie przypomina o ważnych terminach i pozwala dodawać notatki do każdego etapu.",
      },
      {
        question: "Jak działa dopasowanie CV przez AI?",
        answer:
          "Nasza sztuczna inteligencja analizuje treść Twojego CV oraz wymagania z ogłoszenia o pracę. System porównuje kluczowe słowa, umiejętności i doświadczenie, aby określić procentowe dopasowanie. Dodatkowo, otrzymujesz spersonalizowane sugestie, co możesz poprawić, aby zwiększyć swoje szanse.",
      },
      {
        question: "Czy mogę eksportować moje CV do różnych formatów?",
        answer:
          "Tak, w zależności od wybranego planu, możesz eksportować swoje CV do formatów PDF, DOCX oraz HTML. W planach premium otrzymujesz dodatkowo dostęp do zaawansowanych opcji formatowania i personalizacji eksportu.",
      },
      {
        question: "Jak działają powiadomienia o zmianach statusu?",
        answer:
          "System wysyła powiadomienia w trzech przypadkach: gdy zbliża się termin rozmowy kwalifikacyjnej, gdy status Twojej aplikacji się zmienia, oraz gdy pojawią się nowe oferty mocno dopasowane do Twojego profilu. Powiadomienia możesz otrzymywać przez email, w przeglądarce lub w aplikacji.",
      },
      {
        question: "Czy mogę synchronizować kalendarz rozmów?",
        answer:
          "Tak, JustSend.cv pozwala na synchronizację terminów rozmów kwalifikacyjnych z Twoim kalendarzem Google lub Outlook. System automatycznie dodaje wydarzenia i wysyła przypomnienia przed każdą rozmową.",
      },
      {
        question: "Ile aplikacji mogę śledzić w darmowym planie?",
        answer:
          "W darmowym planie możesz śledzić do 10 aktywnych aplikacji jednocześnie. Jest to wystarczająca liczba, aby przetestować wszystkie funkcjonalności. W planach premium otrzymujesz nielimitowaną liczbę aplikacji oraz dodatkowe funkcje analityczne.",
      }
    ]
  
    return (
      <section id="faq" className="container mx-auto py-24 px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Najczęściej zadawane pytania
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Znajdź odpowiedzi na najczęstsze pytania o JustSend.cv
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    )
  }
  