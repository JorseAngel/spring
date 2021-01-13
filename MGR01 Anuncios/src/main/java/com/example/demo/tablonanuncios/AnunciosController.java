package com.example.demo.tablonanuncios;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Collection;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import javax.imageio.stream.FileImageInputStream;
import javax.servlet.http.HttpServletResponse;

import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AnunciosController {

  private Map<Long, Anuncio> anuncios = new ConcurrentHashMap<>();
  private AtomicLong lastId = new AtomicLong();

  @RequestMapping(value = "/anuncios/", method = RequestMethod.GET)
  public Collection<Anuncio> anuncios() {
    return anuncios.values();
  }

  @RequestMapping(value = "/anuncios/", method = RequestMethod.POST)
  @ResponseStatus(HttpStatus.CREATED)
  public Anuncio nuevoAnuncio(@RequestBody Anuncio anuncio) {

    long id = lastId.incrementAndGet();
    anuncio.setId(id);
    anuncios.put(id, anuncio);

    return anuncio;
  }

  @RequestMapping(value = "/anuncios/{id}", method = RequestMethod.PUT)
  public ResponseEntity<Anuncio> actulizaAnuncio(@PathVariable long id, @RequestBody Anuncio anuncioActualizado) {

    Anuncio anuncio = anuncios.get(id);

    if (anuncio != null) {

      anuncioActualizado.setId(id);
      anuncios.put(id, anuncioActualizado);

      return new ResponseEntity<>(anuncioActualizado, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }

  @RequestMapping(value = "/anuncios/{id}", method = RequestMethod.GET)
  public ResponseEntity<Anuncio> getAnuncio(@PathVariable long id) {

    Anuncio anuncio = anuncios.get(id);

    if (anuncio != null) {
      return new ResponseEntity<>(anuncio, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }

  @RequestMapping(value = "/anuncios/{id}", method = RequestMethod.DELETE)
  public ResponseEntity<Anuncio> borraAnuncio(@PathVariable long id) {

    Anuncio anuncio = anuncios.remove(id);

    if (anuncio != null) {
      return new ResponseEntity<>(anuncio, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }

  @RequestMapping("/gatito")
  public void gato(HttpServletResponse response) throws FileNotFoundException, IOException {
    response.addHeader("Content-type", "image/jpeg");
    IOUtils.copy(new FileInputStream("C:\\2020Verano II\\spring\\MGR01\\gato.jpg"), response.getOutputStream());
  }
}