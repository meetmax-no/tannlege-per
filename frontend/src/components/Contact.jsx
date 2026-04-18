import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle } from 'lucide-react';
import { clinicInfo } from '../data/mockData';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mock API call - will be replaced with real backend
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessModal(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 1000);
  };

  const closeModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <section id="kontakt" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
            Kontakt oss
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ta kontakt for timebestilling eller spørsmål. Vi er her for å hjelpe deg!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <Card className="border-2 border-amber-100 shadow-lg h-full">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-amber-900 mb-6">
                  Send oss en melding
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Navn *
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                      placeholder="Ditt fulle navn"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-post *
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                      placeholder="din@epost.no"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefon
                    </label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                      placeholder="Ditt telefonnummer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Melding *
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                      placeholder="Fortell oss hva vi kan hjelpe deg med..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white text-lg py-6"
                  >
                    {isSubmitting ? (
                      'Sender...'
                    ) : (
                      <>
                        <Send size={20} className="mr-2" />
                        Send melding
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="border-2 border-amber-100 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-amber-900 mb-6">
                  Kontaktinformasjon
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="text-amber-700" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Telefon</h4>
                      <a
                        href={`tel:${clinicInfo.phone.replace(/\s/g, '')}`}
                        className="text-amber-700 hover:text-amber-800 transition-colors"
                      >
                        {clinicInfo.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="text-amber-700" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">E-post</h4>
                      <a
                        href={`mailto:${clinicInfo.email}`}
                        className="text-amber-700 hover:text-amber-800 transition-colors"
                      >
                        {clinicInfo.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="text-amber-700" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Adresse</h4>
                      <p className="text-gray-700">{clinicInfo.address}</p>
                      <p className="text-sm text-gray-600 mt-2">
                        <strong>Buss:</strong> {clinicInfo.transport}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Parkering:</strong> {clinicInfo.parking}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-amber-100 shadow-lg overflow-hidden">
              <div className="h-64 bg-gray-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1999.8076389453043!2d10.756989216095!3d59.92254988187035!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46416e7d8c8e8f3b%3A0x3d6f8c8a8c8e8f3b!2sWaldemar%20Thranes%20gate%2068%2C%200173%20Oslo!5e0!3m2!1sen!2sno!4v1234567890123!5m2!1sen!2sno"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Kart til Tannlegene Måreid"
                ></iframe>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Takk for din henvendelse!
            </DialogTitle>
            <DialogDescription className="text-base text-gray-600 mt-3">
              Vi har mottatt meldingen din og vil kontakte deg så snart som mulig.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6">
            <Button
              onClick={closeModal}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white text-lg py-6"
            >
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};
