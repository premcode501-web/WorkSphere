using System;
using System.Collections.Generic;

namespace WorkSphere.Application.DTOs
{
    public class PaginatedResponse<T>
    {
        public IEnumerable<T> Items { get; set; } = Array.Empty<T>();

        public int PageNumber { get; set; }

        public int PageSize { get; set; }

        public int TotalCount { get; set; }

        public int TotalPages { get; set; }
    }
}