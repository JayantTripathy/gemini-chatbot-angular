import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, HttpClientModule,FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css'
})
export class ChatbotComponent {
  geminiApiKey = '**************************************'; // Add your gemini key here
  geminiEndpoint = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';
  messages: any[] = [];
  input: string = '';
  @ViewChild('messagesEnd') messagesEnd!: ElementRef;
  constructor(private http: HttpClient) { }
  sendMessage(userInput: string) {
    const headers = new HttpHeaders({
      'x-goog-api-key': this.geminiApiKey,
      'Content-Type': 'application/json',
    });
    const payload = {
      contents: [
        {
          parts: [
            {
              text: userInput,
            },
          ],
        },
      ],
    };
    
    this.messages.push({ role: 'user', content: userInput });
    this.input = '';
    this.http.post(this.geminiEndpoint, payload, { headers }).subscribe(
      (response:any) => {
        console.log('API Response:', response);
        const responseText = response?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from API'
        const isCodeBlock = responseText.startsWith('```') && responseText.endsWith('```');
        this.messages.push({ role: 'assistant', content: responseText.toString(), isCodeBlock });
        console.log(this.messages);
        this.scrollToBottom();
      },
      (error) => {
        console.error('Error handling user message:', error);
        this.messages.push({ role: 'assistant', content: 'Sorry, something went wrong.' });
        this.scrollToBottom();
      }
    );
    userInput = '';
  }
  scrollToBottom(): void {
    try {
      this.messagesEnd?.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
    catch (err) { console.error('Scroll to bottom error:', err); }
  }

}
