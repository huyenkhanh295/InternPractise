var tvmazeApi = {
  baseUrl: 'https://api.tvmaze.com',

  searchShowByName(keyword) {
    return $.ajax({
      url: `${this.baseUrl}/search/shows?q=${keyword}`,
      type: 'GET',
    })
      .done((res) => {
        console.log(res);
      })
      .fail((err) => {
        console.error(err);
      });
  },

  searchShowById(id) {
    return $.ajax({
      url: `${this.baseUrl}/search/shows?q=${id}`,
      type: 'GET',
    })
      .done((res) => {
        console.log(res);
      })
      .fail((err) => {
        console.error(err);
      });
  },

  getShowCrew(id) {
    return $.get({
      url: `${this.baseUrl}/shows/${id}/crew`,
    })
      .done((res) => {
        console.log(res);
      })
      .fail((err) => {
        console.log(err);
      });
  },

  getShowCast(id) {
    return $.get({
      url: `${this.baseUrl}/shows/${id}/cast`,
    })
      .done((res) => {
        console.log(res);
      })
      .fail((err) => {
        console.log(err);
      });
  },

  getShowImages(id) {
    return $.get({
      url: `${this.baseUrl}/shows/${id}/images`,
    })
      .done((res) => {
        console.log(res);
      })
      .fail((err) => {
        console.log(err);
      });
  },

  getShowEpisodeList(id) {
    return $.get({
      url: `${this.baseUrl}/shows/${id}/episodes`,
    })
      .done((res) => {
        console.log(res);
      })
      .fail((err) => {
        console.log(err);
      });
  },

  getShowSeasons(id) {
    return $.get({
      url: `${this.baseUrl}/shows/${id}/seasons`,
    })
      .done((res) => {
        console.log(res);
      })
      .fail((err) => {
        console.log(err);
      });
  },
};

var search = {
  crew: null,
  cast: null,
  image: null,
  isShowCrew: false,
  isShowCast: false,
  isShowImage: false,
  init() {
    this.addEvent();
  },

  addEvent() {
    $('.btn-submit').click(this.searchShow);
    $('.menu-item').click(async function () {
      switch ($(this).attr('title')) {
        case 'crew':
          {
            if (!search.isShowCrew) {
              search.showCrew(search.crew);
              search.isShowCrew = true;
              console.log(search.isShowCrew);
            }
          }
          break;
        case 'cast':
          {
            if (!search.isShowCast) {
              cast = await tvmazeApi.getShowCast(search.showID);
              search.showCast(cast);
              search.isShowCast = true;
            }
          }
          break;
        case 'gallery':
          {
            if (!search.isShowImage) {
              image = await tvmazeApi.getShowImages(search.showID);
              search.showGallery(image);
              search.isShowImage = true;
            }
          }
          break;
      }
      $('.btn-back').click(() => {
        $('.show-information').addClass('display-none');
        $('.list-result').removeClass('display-none');

        $('.menu-item').removeClass('active');
        $('.menu-item:first').addClass('active');
        $('.content').addClass('display-none');
        $('.main-content').removeClass('display-none');
        search.isShowCrew = false;
        search.isShowCast = false;
        search.isShowImage = false;
      });
      $('.menu-item').removeClass('active');
      $(this).addClass('active');
      $('.content').addClass('display-none');
      $(`.${$(this).attr('title')}-content`).removeClass('display-none');
    });
  },

  async searchShow() {
    listResult = $('.list-result');
    //delete a previous result
    listResult.empty();

    const keyword = $('#input-search').val();
    if (keyword != '') {
      let result = await tvmazeApi.searchShowByName(keyword);
      if (result.length > 0) {
        for (item of result) {
          let divElement = $('<div></div'),
            imgElement = $('<img>'),
            aElement = $('<a></a>');
          divElement.addClass('result-item');
          aElement
            .addClass('item-title')
            .attr('title', `${item.show.name}`)
            .text(`${item.show.name}`);
          imgElement.addClass('image-item').attr('title', `${item.show.name}`);
          try {
            imgElement.attr('src', `${item.show.image.medium}`);
          } catch {
            imgElement.attr(
              'src',
              'https://static.tvmaze.com/images/no-img/no-img-portrait-clean.png'
            );
          }
          listResult.append(divElement.append(imgElement).append(aElement));
          // add event click for img and a of each show
          imgElement.click(search.getShowDetail.bind(item.show));
          aElement.click(search.getShowDetail.bind(item.show));
        }
      } else {
        listResult.text('No results found!');
      }
    }
  },

  async getShowDetail() {
    //hide the list result of show and show the show information
    $('.list-result').addClass('display-none');
    $('.show-information').removeClass('display-none');
    $('.rating-result').empty();
    //name, image and description of show
    try {
      $('.show-image').attr('src', `${this.image.medium}`);
    } catch {
      $('.show-image').attr(
        'src',
        'https://static.tvmaze.com/images/no-img/no-img-portrait-clean.png'
      );
    }
    $('.show-name').text(`${this.name}`);
    $('.show-description').html(`${this.summary}`);

    // Show detail information
    $('.detail-list').empty();
    let detailList = $('.detail-list');

    // because the object sometime get null or empty value => check the value
    if (this.network)
      detailList.append(
        `<div><strong>Network: </strong><a href="#">${this.network.name}</a></div>`
      );
    if (this.webChannel)
      detailList.append(
        `<div><strong>Web channel: </strong><a href="#">${this.webChannel.name}</a></div>`
      );
    if (this.schedule.time == '') {
      detailList.append(
        `<div><strong>Schedule: </strong>${this.schedule.days[0]}</div>`
      );
    } else {
      detailList.append(
        `<div><strong>Schedule: </strong>${this.schedule.days[0]} at ${this.schedule.time} (${this.runtime} min)</div>`
      );
    }
    detailList
      .append(`<div><strong>Status: </strong>${this.status}</div>`)
      .append(`<div><strong>Show Type: </strong>${this.type}</div>`);
    let genresLength = this.genres.length;
    if (genresLength > 0) {
      let listGenres = this.genres[0];
      for (let i = 1; i < genresLength; i++) {
        listGenres += ` | ${this.genres[i]}`;
      }
      detailList.append(`<div><strong>Genres: </strong>${listGenres}</div>`);
    }
    // episodes
    let season = await tvmazeApi.getShowSeasons(this.id);
    if (season[0].episodeOrder) {
      detailList.append(
        `<div><strong>Episodes ordered: </strong><a href="#">${season[0].episodeOrder} episodes</a></div>`
      );
    }
    // official site
    if (this.officialSite) {
      let shortLink = this.officialSite.replace(/(http:\/\/)|(https:\/\/)/, '');
      shortLink = shortLink.substr(0, shortLink.indexOf('/'));
      detailList.append(
        `<div><strong>Official site: </strong><a target="_blank" href="${this.officialSite}">${shortLink}</a></div>`
      );
    }

    // creator
    search.showID = this.id;
    search.crew = await tvmazeApi.getShowCrew(this.id);
    if (search.crew) {
      let listCrew = [];
      for (item of search.crew) {
        if (item.type == 'Creator') listCrew.push(item);
      }
      if (listCrew.length > 0) {
        let listCreator = `<a>${listCrew[0].person.name}</a>`;
        for (let i = 1; i < listCrew.length; i++) {
          listCreator += ` | <a>${listCrew[i].person.name}</a>`;
        }
        detailList.append(
          `<div><strong>Created by: </strong>${listCreator}</div>`
        );
      }
    }
    // rating

    if ($('.star').hasClass('star-rating'))
      $('.star').removeClass('star-rating');

    if (this.rating.average)
      $('.rating-result').append(`<strong>${this.rating.average}</strong>`);
    else $('.rating-result').append('waiting for more votes');
    rate = Math.floor(this.rating.average);
    for (let i = 1; i <= rate; i++)
      $(`.star:nth-child(${i})`).addClass('star-rating');
  },

  showCrew(crew) {
    listCrew = $('.crew-content');
    listCrew.empty();
    if (crew.length > 0) {
      for (item of crew) {
        let divCrewItem = $('<div></div').addClass('crew-item'),
          imgCrew = $('<img>')
            .addClass('crew-img content-img')
            .attr('title', `${item.person.name}`),
          divCrewInfo = $('<div></div').addClass('crew-info'),
          h2CrewName = $('<h2></h2>'),
          aCrewName = $('<a></a>')
            .addClass('crew-name')
            .attr({
              href: `${item.person.url}`,
              title: `${item.person.name}`,
              target: '_blank',
            })
            .text(`${item.person.name}`),
          spanCrewType = $('<span></span>').text(`as ${item.type}`);

        try {
          imgCrew.attr('src', `${item.person.image.medium}`);
        } catch {
          imgCrew.attr(
            'src',
            'https://static.tvmaze.com/images/no-img/no-img-portrait-clean.png'
          );
        }

        listCrew.append(
          divCrewItem
            .append(imgCrew)
            .append(
              divCrewInfo
                .append(h2CrewName.append(aCrewName))
                .append(spanCrewType)
            )
        );
      }
    } else {
      listCrew.text('No crew found!');
    }
  },

  showCast(cast) {
    listCast = $('.cast-content');
    listCast.empty();
    if (cast.length > 0) {
      for (item of cast) {
        let divCastItem = $('<div></div').addClass('cast-item'),
          imgCast = $('<img>').addClass('cast-img content-img'),
          divCastInfo = $('<div></div').addClass('cast-info'),
          h2CastName = $('<h2></h2>'),
          aCastName = $('<a></a>')
            .addClass('cast-name')
            .attr({
              href: `${item.person.url}`,
              title: `${item.person.name}`,
              target: '_blank',
            })
            .text(`${item.person.name}`),
          spanCastName = $('<span></span>').text('as '),
          aCharacterName = $('<a></a>')
            .addClass('cast-character-name')
            .attr({
              href: `${item.character.url}`,
              title: `${item.character.name}`,
              target: '_blank',
            })
            .text(`${item.character.name}`);

        try {
          imgCast.attr('src', `${item.character.image.medium}`);
        } catch {
          imgCast.attr(
            'src',
            'https://static.tvmaze.com/images/no-img/no-img-portrait-clean.png'
          );
        }

        listCast.append(
          divCastItem
            .append(imgCast)
            .append(
              divCastInfo
                .append(h2CastName.append(aCastName))
                .append(spanCastName.append(aCharacterName))
            )
        );
      }
    } else {
      listCast.text('No cast found!');
    }
  },

  showGallery(image) {
    // delete previous gallery
    listGallery = $('.gallery-content');
    listGallery.empty();

    if (image.length > 0) {
      // create a unique gallery type array
      let listType = [];
      for (item of image) {
        listType.push(item.type);
      }

      let uniqueType = listType.filter(function (item, i, listType) {
        return i == listType.indexOf(item);
      });

      // create gallery session for each type
      for (type of uniqueType) {
        divType = $('<div></div>').addClass(`${type}-session gallery-session`);
        h2GalleryName = $('<h2></h2')
          .text(`${type}s`)
          .css('text-transform', 'capitalize');
        (divImageContainer = $('<div></div').addClass('gallery-img-container')),
          listGallery.append(
            divType.append(h2GalleryName).append(divImageContainer)
          );
      }

      // create each gallery item for gallery type
      for (item of image) {
        for (type of uniqueType) {
          if (item.type == type) {
            (divGalleryItem = $('<div></div').addClass('gallery-item')),
              (divImage = $('<div></div').addClass('gallery-item-img')),
              (aImage = $('<a></a')),
              (imgImage = $('<img></img').addClass('gallery-img content-img'));

            try {
              aImage.attr({
                href: `${item.resolutions.original.url}`,
                target: '_blank',
              });
              imgImage.attr('src', `${item.resolutions.original.url}`);
            } catch {
              aImage.attr({
                href: `${item.resolutions.medium.url}`,
                target: '_blank',
              });
              imgImage.attr('src', `${item.resolutions.medium.url}`);
            }

            $(`.${type}-session .gallery-img-container`).append(
              divGalleryItem.append(divImage.append(aImage.append(imgImage)))
            );
          }
        }
      }
    } else {
      listGallery.text('No gallery found!');
    }
  },
};

$(function () {
  search.init();
});
